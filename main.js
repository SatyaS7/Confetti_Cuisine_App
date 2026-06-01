// main.js (Updated CRUD Pipeline Configuration)
"use strict";

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // Middleware to simulate PUT/DELETE
const usersController = require("./controllers/usersController");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");

const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/recipe_db";
mongoose.connect(dbURI);
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3003);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configure method-override to scan for the "_method" query tag parameter
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// 1. Initialize Cookie & Session parameters
app.use(cookieParser("secret_cuisine_passcode"));
app.use(session({
    secret: "secret_cuisine_passcode",
    cookie: { maxAge: 4000000 }, // Sets expiration timing
    resave: false,
    saveUninitialized: false
}));

// 2. Activate flash messages utility
app.use(flash());

// 3. Assign flash notifications to local response objects so they are globally readable inside EJS views
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

// Initialize modules via Express
app.use(passport.initialize());
app.use(passport.session());

// Use the strategy method injected onto our User model by the plugin
passport.use(User.createStrategy());
// Compact, encrypt, and serialize active data states down to cookies
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Create global helper booleans to verify user login states inside EJS views seamlessly
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

// RESTFUL CRUD ROUTES TRACKER
//app.get("/users", usersController.index);                  // Read All
//app.get("/users/new", usersController.new);                // Create Form View
//app.post("/users/create", usersController.create);          // Create Action Execution
//app.get("/users/:id", usersController.show);                // Read Individual Profile
//app.get("/users/:id/edit", usersController.edit);            // Update Form View
//app.put("/users/:id/update", usersController.update);        // Update Action Execution
//app.delete("/users/:id/delete", usersController.delete);    // Delete Action Execution
//app.get("/users/login", usersController.login);
//app.post("/users/login", usersController.authenticate);
//app.get("/users/logout", usersController.logout);


// main.js (Updated & Ordered Route Registry)

// 1. STATIC ROUTES (Place these first)
app.get("/users", usersController.index);                  // Read All
app.get("/users/new", usersController.new);                // Create Form View

app.post("/users/create", usersController.create);         // Handle Form Submission Payloads

app.get("/users/login", usersController.login);            // Render Login View
app.post("/users/login", usersController.authenticate);    // Process Login Form
app.get("/users/logout", usersController.logout);          // Handle Logouts

// 2. DYNAMIC PARAMETER ROUTES (Place these last)
app.get("/users/:id", usersController.show);                // Read Individual Profile
app.get("/users/:id/edit", usersController.edit);            // Update Form View
app.put("/users/:id/update", usersController.update);        // Update Action Execution
app.delete("/users/:id/delete", usersController.delete);    // Delete Action Execution

const server = app.listen(app.get("port"), () => {
    console.log(`Application running at http://localhost:${app.get("port")}`);
});

// 2. Initialize Socket.io by passing it your running server instance
const io = require("socket.io")(server);

app.use((error, req, res, next) => {
    console.log(error.stack);
    res.status(500).send(error.message);
});

// 3. Import your chat controller asset (we will build this next)
const chatController = require("./controllers/chatController")(io);

// Add this near the bottom of main.js to intercept requests with your new modular pipeline router
const routes = require("./routes/index");
app.use("/", routes);

app.get("/chat", (req, res) => {
    res.render("chat");
});
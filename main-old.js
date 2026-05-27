// main.js (Updated with Controllers and Routes)
"use strict";

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const subscribersController = require("./controllers/subscribersController");

mongoose.connect("mongodb://localhost:27017/recipe_db");
app.set("port", process.env.PORT || 3003);
app.set("view engine", "ejs");

// Middleware to parse incoming URL-encoded form submissions payload bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Application Routing Routes Maps
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/contact", subscribersController.getSignUpPage);
app.post("/subscribe", subscribersController.saveSubscriber);

app.get("/", (req, res) => res.send("Welcome to the Database-Backed App!"));

app.listen(app.get("port"), () => console.log(`App running at http://localhost:${app.get("port")}`));

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});
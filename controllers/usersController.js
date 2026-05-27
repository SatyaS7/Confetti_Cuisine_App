// controllers/usersController.js
"use strict";

const User = require("../models/user");
const passport = require("passport");

module.exports = {
	login: (req, res) => {
        res.render("users/login");
    },
	
	// Handle Authentication validation calls automatically via Passport strategy checks
    authenticate: passport.authenticate("local", {
        successRedirect: "/users",
        successFlash: "Welcome back to Confetti Cuisine!",
        failureRedirect: "/users/login",
        failureFlash: "Invalid email login credentials or password."
    }),
	
	// Handle system Logouts
    logout: (req, res, next) => {
        req.logout(error => {
            if (error) return next(error);
            req.flash("success", "You have successfully logged out!");
            res.redirect("/users/login");
        });
    },
	
    // 1. INDEX: Read all documents and render them
    index: (req, res, next) => {
        User.find({})
            .then(users => {
                res.render("users/index", { users: users });
            })
            .catch(error => {
                next(error);
            });
    },

    // 2. NEW: Render blank form view
    new: (req, res) => {
        res.render("users/new");
    },
	
	create: async (req, res, next) => {
		try {

			const newUser = new User({
				name: {
					first: req.body.first,
					last: req.body.last
				},
				email: req.body.email
			});

			const registeredUser = await User.register(
				newUser,
				req.body.password
			);

			console.log("USER REGISTERED:", registeredUser);

			req.flash(
				"success",
				`Account created successfully for ${registeredUser.email}`
			);

			return res.redirect("/users");

		} catch (error) {

			console.log("REGISTER ERROR:", error);

			req.flash("error", error.message);

			return res.redirect("/users/new");
		}
	},	

    // 4. SHOW: Fetch one explicit profile matching an ID parameter
    show: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.render("users/show", { user: user });
            })
            .catch(error => next(error));
    },

    // 5. EDIT: Locate target document and pre-populate edit form fields
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.render("users/edit", { user: user });
            })
            .catch(error => next(error));
    },

    // 6. UPDATE: Process modification payloads and overwrite target record
    update: (req, res, next) => {
        let userId = req.params.id;
        let updatedParams = {
            name: { first: req.body.first, last: req.body.last },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        };

        User.findByIdAndUpdate(userId, { $set: updatedParams })
            .then(user => {
                res.redirect(`/users/${userId}`);
            })
            .catch(error => next(error));
    },

    // 7. DELETE: Wipe target record out of system memory arrays completely
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndDelete(userId)
            .then(() => {
                res.redirect("/users");
            })
            .catch(error => next(error));
    }
};
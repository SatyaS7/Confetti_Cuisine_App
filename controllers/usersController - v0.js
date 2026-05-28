// controllers/usersController.js
"use strict";

const User = require("../models/user");

module.exports = {
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

    // 3. CREATE: Save submitted database records
    create: (req, res, next) => {
        let userParams = {
            name: { first: req.body.first, last: req.body.last },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        };
        User.create(userParams)
            .then(user => {
				req.flash("success", `${user.fullName}'s profile registered successfully!`);
                res.redirect("/users");
            })
            .catch(error => {
				req.flash("error", `Failed to create user account: ${error.message}`);
                res.redirect("/users/new");
            });
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
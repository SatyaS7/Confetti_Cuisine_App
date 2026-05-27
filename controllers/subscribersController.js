// controllers/subscribersController.js
"use strict";

const Subscriber = require("../models/subscriber");

// ACTION A: Fetch all documents out of the collection and render them
exports.getAllSubscribers = (req, res, next) => {
    Subscriber.find({})
        .then(subscribers => {
            // Pass the resulting document array into our subscribers.ejs view template
            res.render("subscribers", { subscribers: subscribers });
        })
        .catch(error => {
            console.log(`Error fetching subscribers: ${error.message}`);
            res.redirect("/");
        });
};

// ACTION B: Render the contact sign-up form view
exports.getSignUpPage = (req, res) => {
    res.render("contact");
};

// ACTION C: Receive form payload submissions and save directly to MongoDB
exports.saveSubscriber = (req, res) => {
    let newSubscriber = new Subscriber({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    });

    newSubscriber.save()
        .then(result => {
            res.render("thanks");
        })
        .catch(error => {
            res.send(error);
        });
};
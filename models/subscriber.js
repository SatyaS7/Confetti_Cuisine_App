// models/subscriber.js
"use strict";

const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true // Prevents saving blank or missing fields
    },
    email: {
        type: String,
        required: true,
        unique: true,   // Ensures no duplicate records exist in the system
        lowercase: true // Automatically converts input strings to lowercase letters
    },
    zipCode: {
        type: Number,
        min: [10000, "Zip code is too short!"], // Enforces minimum constraint rules
        max: 99999
    },
    // RELATIONAL LINK ASSOCIATION
    // Stores an array of MongoDB Document IDs referencing a separate "Course" collection model
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
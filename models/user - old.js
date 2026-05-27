// models/user.js
"use strict";

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        first: { type: String, required: true }, // Nested sub-properties
        last: { type: String, required: true }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true // We will hash this securely in later lessons!
    },
    subscribedAccount: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subscriber" // Links a User account directly to a Subscriber profile
    }
}, {
    timestamps: true // Automatically injects and manages createdAt and updatedAt fields
});

// VIRTUAL ATTRIBUTE
// Combines fields dynamically on-the-fly without saving redundant text to disk
userSchema.virtual("fullName").get(function() {
    return `${this.name.first} ${this.name.last}`;
});

module.exports = mongoose.model("User", userSchema);
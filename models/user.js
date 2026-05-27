// models/user.js
"use strict";

const mongoose = require("mongoose");
// Require the local mongoose passport plugin
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    email: { type: String, required: true, unique: true, lowercase: true }
}, {
    timestamps: true
});

userSchema.virtual("fullName").get(function() {
    return `${this.name.first} ${this.name.last}`;
});

// Attach the plugin and define your login identifier field key
//userSchema.plugin(passportLocalMongoose, {
  //  usernameField: "email"
//});
userSchema.plugin(passportLocalMongoose.default, {
    usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);
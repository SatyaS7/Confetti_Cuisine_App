// controllers/api/coursesController.js
"use strict";

// Assuming you have a Course model built or can use your existing User/Subscriber collections similarly
const Course = require("../../models/course"); 

module.exports = {
    // Action to fetch documents and serialize them cleanly as raw JSON data arrays
    index: async (req, res, next) => {
        try {
            const courses = await Course.find({});
            // Return raw data objects instead of standard HTML pages
            return res.json(courses); 
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

// Append directly inside controllers/api/coursesController.js
const User = require("../../models/user");

exports.join = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const currentUser = req.user; // Passport extracts this automatically out of browser session cookie tracking

        if (!currentUser) {
            return res.status(401).json({ success: false, message: "User must be logged in to join classes." });
        }

        // Atomically push the targeted course database identification reference string into the user's data array
        // $addToSet acts as a built-in protective check preventing duplicate links
        await User.findByIdAndUpdate(currentUser._id, {
            $addToSet: { courses: courseId }
        });

        return res.json({ success: true, message: "Successfully enrolled in course!" });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
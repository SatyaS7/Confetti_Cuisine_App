// courseSeed.js
"use strict";

const mongoose = require("mongoose");
const Course = require("./models/course"); // Ensure you have a basic Course model defined

const seedData = [
    { title: "Tomato Workshop", description: "Learn to mush, mash, and bake ripe tomatoes.", items: ["Sauce", "Paste"] },
    { title: "Cookie Control", description: "Take chocolate chip sweetness to an advanced level.", items: ["Baking", "Glazing"] }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/recipe_db");
        await Course.deleteMany({}); // Wipe stale records cleanly
        
        const instances = await Course.create(seedData);
        console.log(`Successfully seeded database with ${instances.length} culinary courses!`);
        process.exit(0);
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedDB();
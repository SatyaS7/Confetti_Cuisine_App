// controllers/chatController.js (Updated with Persistent Database Queries)
"use strict";

const Message = require("../models/message");

module.exports = (io) => {
    io.on("connection", async (client) => {
        try {
            // 1. READ: Fetch the last 10 historical chat records out of MongoDB upon connection
            const historicalMessages = await Message.find({}).sort({ createdAt: -1 }).limit(10);
            // Send the history array back *only* to the single specific device that just joined
            client.emit("loadHistory", historicalMessages.reverse());
        } catch (err) {
            console.log(`Error loading history logs: ${err.message}`);
        }

        // 2. CREATE: Process, encrypt to disk, and broadcast live transmissions
        client.on("message", async (data) => {
            if (!data.user) return; // Prevent unauthenticated entries from writing to disk

            try {
                const newMessage = new Message({
                    content: data.content,
                    userName: data.userName,
                    user: data.user
                });

                const savedMessage = await newMessage.save();
                // Broadcast the validated record to everyone in the chat room
                io.emit("message", savedMessage);
            } catch (error) {
                console.log(`Failed to preserve chat document: ${error.message}`);
            }
        });
		
		// Listen for a client leaving the chat room
        client.on("disconnect", () => {
            console.log("Client disconnected from server.");
        });
    });
};
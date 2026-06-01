// public/js/confettiCuisine.js
$(document).ready(() => {
    // Listen for a click event on an HTML modal button element
    $("#modal-button").click(() => {
        $(".modal-body").html(''); // Clear container from stale data items
        
        // Execute an asynchronous background network fetch to your live JSON stream API
        $.get("/api/courses", (data) => {
            data.forEach((course) => {
                $(".modal-body").append(`
                    <div class="course-item" style="padding: 10px; border-bottom: 1px solid #eee;">
                        <span class="course-title" style="font-weight: bold;">${course.title}</span>
                        <div class="course-description">${course.description}</div>
                    </div>
                `);
            });
        });
    });
	
	// Initialize the WebSocket handshake pipeline link
    const socket = io();

    // Capture form post actions and emit structured payloads to the server backend
    $("#chatForm").submit(() => {
        const text = $("#chat-input").val();
        const userId = $("#chat-user-id").val();
        const userName = $("#chat-user-name").val();

        if (!userId) {
            alert("Please sign into your user profile account to message the group!");
            return false;
        }

        socket.emit("message", {
            content: text,
            userName: userName,
            user: userId
        });

        $("#chat-input").val(""); // Clean input field box immediately
        return false; // Prevent form from causing standard page reloads
    });

    // Handle single real-time message arrivals
    socket.on("message", (message) => {
        displayMessage(message);
        // UI Animation: Bounce or highlight an element to let people know a message came in!
        $("#chat-box").animate({ scrollTop: $("#chat-box")[0].scrollHeight }, 200);
    });

    // Handle loading full database logs array elements upon joining
    socket.on("loadHistory", (messages) => {
        messages.forEach(message => displayMessage(message));
        $("#chat-box").scrollTop($("#chat-box")[0].scrollHeight);
    });

    // Shared UI painter helper function
    function displayMessage(msg) {
        $("#chat").append($("<li>").html(`
            <div style="margin-bottom: 8px;">
                <span style="color: #007bff; font-weight: bold;">${msg.userName}:</span> 
                <span style="color: #333;">${msg.content}</span>
            </div>
        `));
    }
});
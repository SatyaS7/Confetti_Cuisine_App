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
});
// routes/apiRoutes.js
"use strict";

const router = require("express").Router();
const apiCoursesController = require("../controllers/api/coursesController");

// Base mapping translates to GET /api/courses
router.get("/courses", apiCoursesController.index);
// Add an explicit parameter mapping link to fire your cross-model enrollment update
router.post("/courses/:id/join", apiCoursesController.join);

module.exports = router;
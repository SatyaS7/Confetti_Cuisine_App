// routes/index.js
"use strict";

const router = require("express").Router();
const apiRoutes = require("./apiRoutes");

// Mount the namespaces onto the master pipeline router tree
router.use("/api", apiRoutes);

module.exports = router;
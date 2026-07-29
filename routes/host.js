const express = require("express");
const router = express.Router();

const hostController = require("../controllers/host.js");
const { isLoggedIn } = require("../middleware.js");

// Host Dashboard Route
router.get(
    "/dashboard",
    isLoggedIn,
    hostController.dashboard
);

module.exports = router;

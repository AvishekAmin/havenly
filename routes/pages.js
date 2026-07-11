const express = require("express");
const router = express.Router();

router.get("/help-center", (req, res) => {
    res.render("pages/help.ejs");
});

router.get("/safety", (req, res) => {
    res.render("pages/safety.ejs");
});

router.get("/cancellation", (req, res) => {
    res.render("pages/cancellation.ejs");
});

router.get("/contact", (req, res) => {
    res.render("pages/contact.ejs");
});

router.get("/about", (req, res) => {
    res.render("pages/about.ejs");
});

router.get("/careers", (req, res) => {
    res.render("pages/careers.ejs");
});

router.get("/press", (req, res) => {
    res.render("pages/press.ejs");
});

router.get("/terms-and-privacy", (req, res) => {
    res.render("pages/privacy.ejs");
});

module.exports = router;

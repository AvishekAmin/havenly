const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.js");
const { isLoggedIn } = require("../middleware.js");

// My Bookings Page
router.get(
    "/my-bookings",
    isLoggedIn,
    bookingController.myBookings
);

router.post(
    "/create-order",
    isLoggedIn,
    bookingController.createOrder
);

router.post(
    "/verify-payment",
    isLoggedIn,
    bookingController.verifyPayment
);

module.exports = router;
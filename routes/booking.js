const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.js");
const { isLoggedIn, isBookingOwner } = require("../middleware.js");

// My Bookings Page
router.get(
    "/my-bookings",
    isLoggedIn,
    bookingController.myBookings
);

// Booking Details Page
router.get(
    "/:bookingId",
    isLoggedIn,
    isBookingOwner,
    bookingController.showBooking
);

// Cancel Booking Route
router.post(
    "/:bookingId/cancel",
    isLoggedIn,
    isBookingOwner,
    bookingController.cancelBooking
);

// Download Booking Receipt (PDF)
router.get(
    "/:bookingId/receipt",
    isLoggedIn,
    isBookingOwner,
    bookingController.downloadReceipt
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
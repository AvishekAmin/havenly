const mongoose = require("mongoose");
const crypto = require("crypto");

const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const wrapAsync = require("../utils/wrapAsync");
const calculateBookingPrice = require("../utils/bookingCalculator.js");

const razorpay = require("../razorpay.js");

module.exports.createOrder = wrapAsync(async (req,res)=> {
    const {
        listingId,
        checkIn,
        checkOut,
        guests,
    } = req.body;

    // Basic validation
    if (!listingId || !checkIn || !checkOut || !guests) {
        return res.status(400).json({
            success: false,
            message: "All booking details are required.",
        });
    }

    // Listing ID validation
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid listing ID.",
        });
    }

    // Fetch listing
    const listing = await Listing.findById(listingId);

    if(!listing) {
        return res.status(404).json({
            success: false,
            message: "Listing not found.",
        });
    }

    // Guest Validation
    const guestCount = Number(guests);

    if(Number.isNaN(guestCount) || guestCount < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid number of guests.",
        });
    }

    // Calculate Booking Summary
    let bookingSummary;

    try {
        bookingSummary = calculateBookingPrice(
            listing.price,
            checkIn,
            checkOut,
        );
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    const {
        numberOfNights,
        basePrice,
        taxes,
        totalPrice,
    } = bookingSummary;

    // Create Razorpay Order
    const options = {
        amount: totalPrice * 100,
        currency: "INR",
        receipt: `booking_${Date.now()}`
    };

    let order;

    try {
        order = await razorpay.orders.create(options);
    } catch (error) {
        console.error("Razorpay Error: ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create Razorpay order.",
        });
    }

    //Send Order Details
    return res.status(200).json({
        success: true,
        order,
        bookingDetails: {
            listing: {
                id: listing._id,
                title: listing.title,
            },
            pricePerNight: listing.price,
            numberOfNights,
            basePrice,
            taxes,
            totalPrice,
            guests: guestCount,
        },
    });
});

module.exports.verifyPayment = wrapAsync(async (req,res)=> {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,

        listingId,
        checkIn,
        checkOut,
        guests,
    } = req.body;

    if(
        !razorpay_order_id || !razorpay_payment_id || 
        !razorpay_signature || !listingId || 
        !checkIn || !checkOut || !guests
    ) {
        return res.status(400).json({
            success: false,
            message: "All payment and booking details are required.",
        });
    }

    // Listing ID validation
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid listing ID.",
        });
    }

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
        return res.status(400).json({
            success: false,
            message: "Payment verification failed.",
        });
    }

    const listing = await Listing.findById(listingId);

    // Fetch listing
    if(!listing) {
        return res.status(404).json({
            success: false,
            message: "Listing not found.",
        });
    }

    // Guest Validation
    const guestCount = Number(guests);

    if (Number.isNaN(guestCount) || guestCount < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid number of guests.",
        });
    }

    // Calculate Booking Summary
    let bookingSummary;

    try {
        bookingSummary = calculateBookingPrice(
            listing.price,
            checkIn,
            checkOut
        );
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    const {
        checkInDate,
        checkOutDate,
        numberOfNights,
        basePrice,
        totalPrice,
    } = bookingSummary;

    // Prevent Duplicate Bookings
    const existingBooking = await Booking.findOne({
        $or: [
            { razorpayPaymentId: razorpay_payment_id },
            { razorpayOrderId: razorpay_order_id },
        ],
    });

    if (existingBooking) {
        return res.status(409).json({
            success: false,
            message: "Booking already exists for this payment.",
        });
    }

    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,

        checkIn: checkInDate,
        checkOut: checkOutDate,

        guests: guestCount,

        numberOfNights,
        basePrice,
        totalPrice,

        paymentStatus: "Paid",
        bookingStatus: "Confirmed",

        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
    });

    await booking.save();

    return res.status(200).json({
        success: true,
        message: "Payment verified and booking confirmed.",
        booking: {
            id: booking._id,
            listing: booking.listing,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            paymentStatus: booking.paymentStatus,
            bookingStatus: booking.bookingStatus,
        },
    });
});

module.exports.myBookings = wrapAsync(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate({
            path: "listing",
            populate: {
                path: "owner",
            },
        })
        .sort({ createdAt: -1 });

    res.render("bookings/my-bookings", { bookings });
});
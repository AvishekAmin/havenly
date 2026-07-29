const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const Booking = require("./models/booking");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        let redirectUrl = req.originalUrl;
        if (redirectUrl.includes("/reviews")) {
            redirectUrl = redirectUrl.split("/reviews")[0];
        }
        req.session.redirectUrl = redirectUrl;

        if (req.body && req.body.review) {
            req.session.pendingReview = req.body.review;
        }

        req.flash("error", "You should log in or sign up first to submit a review.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    if (req.body.listing && !req.body.listing.categories) {
        req.body.listing.categories = [];
    }
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isBookingOwner = async (req, res, next) => {
    let { bookingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        req.flash("error", "Invalid booking ID!");
        return res.redirect("/bookings/my-bookings");
    }
    let booking = await Booking.findById(bookingId).populate("listing");
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings/my-bookings");
    }
    const isGuest = booking.user.equals(req.user._id);
    const isHost = booking.listing && booking.listing.owner && booking.listing.owner.equals(req.user._id);
    if (!isGuest && !isHost) {
        req.flash("error", "You don't have permission to view this booking!");
        return res.redirect("/bookings/my-bookings");
    }
    next();
};
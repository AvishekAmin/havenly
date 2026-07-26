const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
        min: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    numberOfNights: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Paid",
            "Failed",
        ],
        default: "Pending",
    },
    bookingStatus: {
        type: String,
        enum: [
            "Confirmed",
            "Cancelled",
            "Completed",
        ],
        default: "Confirmed",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
}, 
{
    timestamps: true,
});

module.exports = mongoose.model("Booking", bookingSchema);
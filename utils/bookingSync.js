const Booking = require("../models/booking.js");

/**
 * Synchronizes booking status for past confirmed bookings.
 * Updates "Confirmed" bookings whose checkOut date is in the past to "Completed".
 * @param {Object} filter - Optional query filter (e.g. { user: userId } or { _id: bookingId })
 */
async function syncBookingStatuses(filter = {}) {
    const now = new Date();
    await Booking.updateMany(
        {
            ...filter,
            bookingStatus: "Confirmed",
            checkOut: { $lt: now },
        },
        {
            $set: { bookingStatus: "Completed" },
        }
    );
}

module.exports = syncBookingStatuses;

const Booking = require("../models/booking.js");

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
    },
  );
}

module.exports = syncBookingStatuses;

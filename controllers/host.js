const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const wrapAsync = require("../utils/wrapAsync");
const syncBookingStatuses = require("../utils/bookingSync.js");

module.exports.dashboard = wrapAsync(async (req, res) => {
  const hostListings = await Listing.find({ owner: req.user._id }).select(
    "_id title image location country price",
  );

  const hostListingIds = hostListings.map((l) => l._id);

  if (hostListingIds.length === 0) {
    return res.render("host/dashboard", {
      hasListings: false,
      hostListings: [],
      totalBookingsCount: 0,
      upcomingCount: 0,
      completedCount: 0,
      totalRevenue: 0,
      upcomingReservations: [],
      recentReservations: [],
    });
  }

  await syncBookingStatuses({ listing: { $in: hostListingIds } });

  const totalBookingsCount = await Booking.countDocuments({
    listing: { $in: hostListingIds },
  });

  const upcomingCount = await Booking.countDocuments({
    listing: { $in: hostListingIds },
    bookingStatus: "Confirmed",
  });

  const completedCount = await Booking.countDocuments({
    listing: { $in: hostListingIds },
    bookingStatus: "Completed",
  });

  const revenueResult = await Booking.aggregate([
    {
      $match: {
        listing: { $in: hostListingIds },
        paymentStatus: "Paid",
        bookingStatus: { $ne: "Cancelled" },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  const totalRevenue =
    revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  const upcomingReservations = await Booking.find({
    listing: { $in: hostListingIds },
    bookingStatus: "Confirmed",
  })
    .populate("user", "username email")
    .populate("listing", "title location country")
    .sort({ checkIn: 1 });

  const recentReservations = await Booking.find({
    listing: { $in: hostListingIds },
  })
    .populate("user", "username email")
    .populate("listing", "title location country")
    .sort({ createdAt: -1 })
    .limit(10);

  res.render("host/dashboard", {
    hasListings: true,
    hostListings,
    totalBookingsCount,
    upcomingCount,
    completedCount,
    totalRevenue,
    upcomingReservations,
    recentReservations,
  });
});

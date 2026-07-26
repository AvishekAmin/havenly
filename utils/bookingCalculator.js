function calculateBookingPrice(pricePerNight, checkIn, checkOut) {
    
    // Convert Dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Check Invalid Dates
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        throw new Error("Invalid booking dates.");
    }

    // Validate Dates
    if(checkOutDate <= checkInDate) {
        throw new Error("Check-out date must be after check-in date.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if(checkInDate < today) {
        throw new Error("Check-in date cannot be in the past.");
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfNights = Math.ceil(
        (checkOutDate - checkInDate) / millisecondsPerDay
    );

    const basePrice = pricePerNight * numberOfNights;
    const taxes = Math.round(basePrice * 0.18);
    const totalPrice = basePrice + taxes;

    return {
        checkInDate,
        checkOutDate,
        numberOfNights,
        basePrice,
        taxes,
        totalPrice,
    };
}

module.exports = calculateBookingPrice;
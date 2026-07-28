const PDFDocument = require("pdfkit");

/**
 * Generates a professional Havenly Booking Receipt PDF and streams it to the response.
 *
 * @param {Object} res - Express response object
 * @param {Object} params
 * @param {Object} params.booking - The populated Booking document
 * @param {Object} params.user - The logged-in User document
 * @param {Object} params.listing - The populated Listing document
 * @param {Number} params.taxes - Derived tax amount (totalPrice - basePrice)
 */
function generateBookingReceipt(res, { booking, user, listing, taxes }) {
    const bookingIdShort = booking._id.toString().slice(-8).toUpperCase();

    const pricePerNight = booking.numberOfNights > 0
        ? Math.round(booking.basePrice / booking.numberOfNights)
        : booking.basePrice;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return `Rs. ${amount.toLocaleString("en-IN")}`;
    };

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="havenly-receipt-${bookingIdShort}.pdf"`
    );

    // Create PDF document
    const doc = new PDFDocument({
        size: "A4",
        margins: { top: 40, bottom: 40, left: 50, right: 50 },
    });

    // Pipe directly to response
    doc.pipe(res);

    const left = doc.page.margins.left;
    const pageWidth = doc.page.width - left - doc.page.margins.right;

    // Helper: draw a horizontal divider at current y
    const drawDivider = () => {
        doc.moveTo(left, doc.y)
            .lineTo(left + pageWidth, doc.y)
            .strokeColor("#e0e0e0")
            .lineWidth(1)
            .stroke();
    };

    // Helper: draw a section heading, always left-aligned
    const drawSectionHeading = (title) => {
        doc.fontSize(11)
            .font("Helvetica-Bold")
            .fillColor("#0070F3")
            .text(title, left, doc.y, { width: pageWidth, align: "left" });
        doc.moveDown(0.3);
    };

    // ==========================================
    // HEADER
    // ==========================================
    doc.fontSize(26)
        .font("Helvetica-Bold")
        .fillColor("#0070F3")
        .text("HAVENLY", left, doc.y, { align: "left" });

    doc.fontSize(9)
        .font("Helvetica")
        .fillColor("#666666")
        .text("Luxury Vacation Rentals", left, doc.y, { align: "left" });

    doc.moveDown(1);
    drawDivider();
    doc.moveDown(0.6);

    // ==========================================
    // BOOKING RECEIPT TITLE
    // ==========================================
    doc.fontSize(16)
        .font("Helvetica-Bold")
        .fillColor("#222222")
        .text("Booking Receipt", left, doc.y, { align: "left" });

    doc.moveDown(0.4);

    doc.fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#888888")
        .text("BOOKING ID", left, doc.y, { width: pageWidth, align: "left" });

    doc.moveDown(0.25);

    doc.fontSize(9)
        .font("Helvetica")
        .fillColor("#333333")
        .text(booking._id.toString(), left, doc.y, { width: pageWidth, align: "left" });

    doc.moveDown(0.5);

    doc.fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#888888")
        .text("BOOKING DATE", left, doc.y, { width: pageWidth, align: "left" });

    doc.moveDown(0.25);

    doc.fontSize(9)
        .font("Helvetica")
        .fillColor("#333333")
        .text(formatDate(booking.createdAt), left, doc.y, { width: pageWidth, align: "left" });

    doc.moveDown(0.8);
    drawDivider();
    doc.moveDown(0.6);

    // ==========================================
    // GUEST INFORMATION
    // ==========================================
    drawSectionHeading("GUEST INFORMATION");
    drawLabelValue(doc, "Name", user.username || "Guest", left, pageWidth);
    drawLabelValue(doc, "Email", user.email || "N/A", left, pageWidth);

    doc.moveDown(0.5);
    drawDivider();
    doc.moveDown(0.6);

    // ==========================================
    // PROPERTY DETAILS
    // ==========================================
    drawSectionHeading("PROPERTY DETAILS");
    drawLabelValue(doc, "Listing", listing ? listing.title : "Listing Unavailable", left, pageWidth);
    if (listing) {
        drawLabelValue(doc, "Location", `${listing.location || ""}, ${listing.country || ""}`, left, pageWidth);
    }

    doc.moveDown(0.5);
    drawDivider();
    doc.moveDown(0.6);

    // ==========================================
    // STAY DETAILS
    // ==========================================
    drawSectionHeading("STAY DETAILS");
    drawLabelValue(doc, "Check-in", formatDate(booking.checkIn), left, pageWidth);
    drawLabelValue(doc, "Check-out", formatDate(booking.checkOut), left, pageWidth);
    drawLabelValue(doc, "Duration", `${booking.numberOfNights} night${booking.numberOfNights > 1 ? "s" : ""}`, left, pageWidth);
    drawLabelValue(doc, "Guests", `${booking.guests} guest${booking.guests > 1 ? "s" : ""}`, left, pageWidth);

    doc.moveDown(0.5);
    drawDivider();
    doc.moveDown(0.6);

    // ==========================================
    // PRICE BREAKDOWN
    // ==========================================
    drawSectionHeading("PRICE BREAKDOWN");
    drawLabelValue(doc, "Price per night", formatCurrency(pricePerNight), left, pageWidth);
    drawLabelValue(doc, `Base price (${booking.numberOfNights} night${booking.numberOfNights > 1 ? "s" : ""})`, formatCurrency(booking.basePrice), left, pageWidth);
    drawLabelValue(doc, "GST & Taxes", formatCurrency(taxes), left, pageWidth);

    doc.moveDown(0.2);

    // Total divider (right-side)
    doc.moveTo(left + 280, doc.y)
        .lineTo(left + pageWidth, doc.y)
        .strokeColor("#cccccc")
        .lineWidth(1)
        .stroke();

    doc.moveDown(0.3);

    // Total amount - highlighted
    const totalY = doc.y;
    doc.fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#222222")
        .text("Total Paid", left, totalY);

    doc.fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#0070F3")
        .text(formatCurrency(booking.totalPrice), left + 280, totalY, {
            width: pageWidth - 280,
            align: "right",
        });

    doc.moveDown(1);
    drawDivider();
    doc.moveDown(0.6);

    // ==========================================
    // STATUS
    // ==========================================
    drawSectionHeading("STATUS");
    drawLabelValue(doc, "Payment Status", booking.paymentStatus, left, pageWidth);
    drawLabelValue(doc, "Booking Status", booking.bookingStatus, left, pageWidth);

    if (booking.razorpayPaymentId) {
        drawLabelValue(doc, "Razorpay Payment ID", booking.razorpayPaymentId, left, pageWidth);
    }

    // Cancelled notice
    if (booking.bookingStatus === "Cancelled") {
        doc.moveDown(0.5);

        const noticeY = doc.y;
        doc.rect(left, noticeY, pageWidth, 30)
            .fillColor("#FFF3F3")
            .fill();

        doc.rect(left, noticeY, pageWidth, 30)
            .strokeColor("#ff4757")
            .lineWidth(0.5)
            .stroke();

        doc.fontSize(9)
            .font("Helvetica-Bold")
            .fillColor("#cc0000")
            .text(
                "This booking has been cancelled. This receipt is for your records only.",
                left + 10,
                noticeY + 10,
                { width: pageWidth - 20 }
            );
    }

    doc.moveDown(1.2);

    // ==========================================
    // FOOTER
    // ==========================================
    drawDivider();
    doc.moveDown(0.6);

    doc.fontSize(9)
        .font("Helvetica")
        .fillColor("#888888")
        .text("Thank you for booking with Havenly.", left, doc.y, { width: pageWidth, align: "center" });

    doc.fontSize(8)
        .fillColor("#aaaaaa")
        .text("This is a system-generated booking receipt and does not require a signature.", left, doc.y, { width: pageWidth, align: "center" });

    // Finalize the PDF
    doc.end();
}

/**
 * Helper: Draw a label-value pair on the same line.
 * Explicitly uses left margin for consistent alignment.
 */
function drawLabelValue(doc, label, value, left, pageWidth) {
    const y = doc.y;

    doc.fontSize(9)
        .font("Helvetica")
        .fillColor("#666666")
        .text(label, left, y, { width: 280, continued: false });

    doc.fontSize(9)
        .font("Helvetica")
        .fillColor("#222222")
        .text(value, left + 280, y, {
            width: pageWidth - 280,
            align: "right",
        });

    doc.y = y + 16;
}

module.exports = generateBookingReceipt;

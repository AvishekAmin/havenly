const nodemailer = require("nodemailer");

/**
 * Creates and configures the Nodemailer transporter.
 * Uses process.env settings if available; otherwise falls back to Ethereal test account for instant local testing.
 */
async function getTransporter() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return {
            transporter: nodemailer.createTransport({
                host: process.env.EMAIL_HOST || "smtp.gmail.com",
                port: parseInt(process.env.EMAIL_PORT || "587"),
                secure: process.env.EMAIL_PORT === "465",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            }),
            from: process.env.EMAIL_FROM || `"Havenly" <${process.env.EMAIL_USER}>`,
            isTestAccount: false,
        };
    }

    // Fallback: Create Ethereal test account for instant testing without SMTP configuration
    try {
        const testAccount = await nodemailer.createTestAccount();
        return {
            transporter: nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            }),
            from: `"Havenly" <${testAccount.user}>`,
            isTestAccount: true,
        };
    } catch (err) {
        console.error("Email Service: Unable to create Ethereal test account:", err.message);
        return null;
    }
}

/**
 * Sends a booking confirmation email asynchronously.
 * Non-blocking secondary side effect — never throws or halts application flow.
 *
 * @param {Object} params
 * @param {Object} params.booking - The saved Booking document
 * @param {Object} params.user - The logged-in User document (containing username and email)
 * @param {Object} params.listing - The Listing document (containing title, location, country)
 */
async function sendBookingConfirmationEmail({ booking, user, listing }) {
    try {
        if (!user || !user.email) {
            console.log("Email Service: No recipient email address provided. Skipping confirmation email.");
            return;
        }

        const transportConfig = await getTransporter();
        if (!transportConfig) {
            console.log("Email Service: Transporter unavailable. Skipping confirmation email.");
            return;
        }

        const { transporter, from: fromSender, isTestAccount } = transportConfig;

        const baseUrl = process.env.APP_BASE_URL || "https://havenly-avishek.onrender.com";
        const taxes = booking.totalPrice - booking.basePrice;
        const bookingIdShort = booking._id.toString().slice(-8).toUpperCase();

        const checkInFormatted = new Date(booking.checkIn).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        const checkOutFormatted = new Date(booking.checkOut).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmed — Havenly</title>
            <style>
                body {
                    font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #050816;
                    color: #e2e8f0;
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                }
                .email-wrapper {
                    width: 100%;
                    background-color: #050816;
                    padding: 40px 15px;
                }
                .email-card {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #0b1120;
                    border: 1px solid rgba(0, 216, 255, 0.2);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                .email-header {
                    background: linear-gradient(135deg, #0b1120 0%, #131c31 100%);
                    padding: 30px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }
                .brand-title {
                    font-size: 24px;
                    font-weight: 800;
                    color: #00D8FF;
                    letter-spacing: 0.5px;
                    margin: 0 0 8px 0;
                }
                .header-subtitle {
                    font-size: 14px;
                    color: #2ed573;
                    font-weight: 600;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .email-body {
                    padding: 30px;
                }
                .greeting {
                    font-size: 18px;
                    font-weight: 600;
                    color: #ffffff;
                    margin-top: 0;
                    margin-bottom: 12px;
                }
                .intro-text {
                    font-size: 14px;
                    color: #94a3b8;
                    line-height: 1.6;
                    margin-bottom: 24px;
                }
                .property-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 24px;
                }
                .property-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0 0 6px 0;
                }
                .property-location {
                    font-size: 13px;
                    color: #00D8FF;
                    margin: 0;
                }
                .details-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 24px;
                }
                .details-table td {
                    padding: 10px 0;
                    border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
                    font-size: 13px;
                }
                .label-cell {
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                }
                .value-cell {
                    color: #ffffff;
                    font-weight: 500;
                    text-align: right;
                }
                .total-row td {
                    border-bottom: none;
                    padding-top: 16px;
                    font-size: 16px;
                    font-weight: 700;
                }
                .total-amount {
                    color: #00D8FF;
                }
                .badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                }
                .badge-paid {
                    background: rgba(46, 213, 115, 0.15);
                    color: #2ed573;
                    border: 1px solid rgba(46, 213, 115, 0.3);
                }
                .badge-confirmed {
                    background: rgba(0, 216, 255, 0.15);
                    color: #00D8FF;
                    border: 1px solid rgba(0, 216, 255, 0.3);
                }
                .cta-container {
                    text-align: center;
                    margin-top: 30px;
                    margin-bottom: 10px;
                }
                .btn-cta {
                    display: inline-block;
                    background: linear-gradient(135deg, #00D8FF 0%, #0070F3 100%);
                    color: #050816 !important;
                    font-size: 14px;
                    font-weight: 700;
                    padding: 14px 32px;
                    border-radius: 50px;
                    text-decoration: none;
                    box-shadow: 0 4px 20px rgba(0, 216, 255, 0.3);
                }
                .email-footer {
                    background-color: #070c18;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #64748b;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-card">
                    <div class="email-header">
                        <div class="brand-title">Havenly</div>
                        <div class="header-subtitle">✓ Booking Confirmed</div>
                    </div>
                    <div class="email-body">
                        <div class="greeting">Hello ${user.username || "Guest"},</div>
                        <div class="intro-text">
                            Great news! Your reservation has been successfully confirmed. Below are your booking details:
                        </div>

                        <div class="property-box">
                            <div class="property-title">${listing.title || "Havenly Property"}</div>
                            <div class="property-location">📍 ${listing.location || ""}, ${listing.country || ""}</div>
                        </div>

                        <table class="details-table">
                            <tr>
                                <td class="label-cell">Reservation ID</td>
                                <td class="value-cell">#${bookingIdShort}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Check-In</td>
                                <td class="value-cell">${checkInFormatted}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Check-Out</td>
                                <td class="value-cell">${checkOutFormatted}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Duration</td>
                                <td class="value-cell">${booking.numberOfNights} night${booking.numberOfNights > 1 ? "s" : ""}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Guests</td>
                                <td class="value-cell">${booking.guests} guest${booking.guests > 1 ? "s" : ""}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Base Price</td>
                                <td class="value-cell">&#8377; ${booking.basePrice.toLocaleString("en-IN")}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">GST &amp; Taxes</td>
                                <td class="value-cell">&#8377; ${taxes.toLocaleString("en-IN")}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Booking Status</td>
                                <td class="value-cell"><span class="badge badge-confirmed">Confirmed</span></td>
                            </tr>
                            <tr>
                                <td class="label-cell">Payment Status</td>
                                <td class="value-cell"><span class="badge badge-paid">Paid (Razorpay)</span></td>
                            </tr>
                            <tr class="total-row">
                                <td class="label-cell" style="font-size: 13px; color: #ffffff;">Total Amount Paid</td>
                                <td class="value-cell total-amount">&#8377; ${booking.totalPrice.toLocaleString("en-IN")}</td>
                            </tr>
                        </table>

                        <div class="cta-container">
                            <a href="${baseUrl}/bookings/my-bookings" class="btn-cta">View My Bookings</a>
                        </div>
                    </div>
                    <div class="email-footer">
                        &copy; ${new Date().getFullYear()} Havenly Luxury Rentals. All rights reserved.<br>
                        This is an automated confirmation email.
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: fromSender,
            to: user.email,
            subject: `Booking Confirmed: ${listing.title} — Havenly`,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email Service: Confirmation email processed for ${user.email} (Message ID: ${info.messageId})`);

        if (isTestAccount) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log("\n========================================================================");
            console.log("✉️ EMAIL PREVIEW URL (Ethereal Test Account):");
            console.log(`👉 ${previewUrl}`);
            console.log("========================================================================\n");
        }
    } catch (error) {
        console.error("Email Service: Non-fatal error sending booking confirmation email:", error.message);
    }
}

module.exports = {
    sendBookingConfirmationEmail,
};

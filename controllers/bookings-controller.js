const Booking = require("../models/bookingsModel");
const BookingCount = require("../models/bookingCount");
const sessionFlash = require("../util/sessionFlash");

async function getBookingsPage(req, res) {
  try {
    // Fetch booking counts for each day of the week (Sunday to Saturday)
    const bookingCounts = await BookingCount.getCounts();

    // Render the bookings page and pass the booking counts
    res.render("customer/shared/bookings", {
      bookingCounts: bookingCounts,
    });
  } catch (error) {
    console.error("Error fetching booking counts:", error);
    res.redirect("/error"); // Handle errors gracefully
  }
}

async function bookings(req, res) {
  try {
    // Create a new booking instance from the form data
    const bookings = new Booking(
      req.body.fullname,
      req.body.email,
      req.body.event_type,
      req.body.service_type,
      req.body.event_date,
      req.body.appointment_time,
      req.body.event_location,
      req.body.additional_info
    );

    // Save the booking to the database
    await bookings.bookings();

    // Get the current day of the week (when the booking form is submitted)
    const currentDate = new Date();
    const currentDay = currentDate
      .toLocaleString("en-us", { weekday: "long" })
      .toLowerCase(); // e.g., "monday", "tuesday", etc.

    // Increment the booking count for the current day
    const bookingCount = new BookingCount();
    await bookingCount.incrementCount(currentDay);

    // Redirect to the home page or booking page after successful submission
    res.redirect("/");
  } catch (error) {
    console.error("Error creating booking:", error);
    sessionFlash.flashMessage(
      req,
      "error",
      "There was an issue with your booking."
    );
    res.redirect("/bookings");
  }
}

module.exports = {
  getBookingsPage: getBookingsPage,
  bookings: bookings,
};

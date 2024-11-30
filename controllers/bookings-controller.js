const Booking = require("../models/bookingsModel");
const sessionFlash = require("../util/sessionFlash");

function getBookingsPage(req, res) {
  res.render("customer/shared/bookings");
}

async function bookings(req, res) {
  const bookings = new Booking(
    req.body.event_type,
    req.body.service_type,
    req.body.event_date,
    req.body.appointment_time,
    req.body.event_location,
    req.body.additional_info
  );

  await bookings.bookings();

  res.redirect("/");
}

module.exports = {
  getBookingsPage: getBookingsPage,
  bookings: bookings,
};

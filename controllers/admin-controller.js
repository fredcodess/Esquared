function getBookings(req, res) {
  res.render("admin/manage-bookings");
}

function getEnquiries(req, res) {
  res.render("admin/enquiries");
}

module.exports = {
  getBookings: getBookings,
  getEnquiries: getEnquiries,
};

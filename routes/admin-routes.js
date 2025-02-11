const express = require("express");

const adminController = require("../controllers/admin-controller");
const imageUploadMiddleware = require("../middlewares/image-uploads");

const router = express.Router();

router.get("/admin/manage-bookings", adminController.getAllBookings);
router.delete("/admin/manage-bookings/:id", adminController.deleteBookings);
router.get("/admin/enquiries", adminController.getEnquiries);
router.post(
  "admin/enquiries/enquiriesResponse",
  adminController.enquiriesResponse
);
router.post("/confirm-booking/:id", adminController.sendEmailResponse);
router.get("/admin/manage-bookings/:id", adminController.getUpdateBooking);

router.get("/admin/analytics", adminController.getAnalyticsPage);

module.exports = router;

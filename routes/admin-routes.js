const express = require("express");

const adminController = require("../controllers/admin-controller");
const imageUploadMiddleware = require("../middlewares/image-uploads");

const router = express.Router();

router.get("/admin/manage-bookings", adminController.getBookings);

router.get("/admin/enquiries", adminController.getEnquiries);

router.get("/bookings/new", adminController.getBookings);

module.exports = router;

const express = require("express");
const contactController = require("../controllers/bookings-controller");

const router = express.Router();

router.get("/bookings", contactController.getBookingsPage);
router.post("/bookings", contactController.bookings);

module.exports = router;

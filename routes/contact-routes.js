const express = require("express");
const contactController = require("../controllers/contact-controller");

const router = express.Router();

router.get("/contact", contactController.getContactPage);
router.post("/contact", contactController.contact);
router.get("/admin/enquiries", contactController.getAllEnquiries);
router.get("/admin/enquiries/:id", contactController.getEnquiriesDetails);
route.post("/admin/enquiries/respond", contactController.getEnquiriesResponse);

module.exports = router;

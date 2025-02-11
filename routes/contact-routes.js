const express = require("express");
const contactController = require("../controllers/contact-controller");

const router = express.Router();

router.get("/contact", contactController.getContactPage);
router.post("/contact", contactController.contact);
router.get("/admin/enquiries", contactController.getAllEnquiries);
router.get("/admin/enquiries/:id", contactController.getUpdateContact);
router.delete("/admin/enquiries/:id", contactController.deleteContact);
router.post("/respond/:id", contactController.sendEmailResponse);

module.exports = router;

const express = require("express");
const router = express.Router();
const backgroundController = require("../controllers/rembg-controller");
const multer = require("multer");
// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// GET route for the index page
router.get("/rembg", backgroundController.getRembgPage);

// POST route for removing background from the image
router.post("/transform", backgroundController.removeBackground);

// POST route for uploading an image
router.post(
  "/upload",
  upload.single("image"),
  backgroundController.getImageUpload
);

// GET route for downloading the processed image
router.get("/download", backgroundController.getDownload);

module.exports = router;

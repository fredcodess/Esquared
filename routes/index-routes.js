const express = require("express");
const indexController = require("../controllers/index-controller");

const router = express.Router();

router.get("/", indexController.getHomePage);

router.get("/price", indexController.getPriceList);

module.exports = router;

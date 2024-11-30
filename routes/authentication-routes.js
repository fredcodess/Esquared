const express = require("express");

const authenticationController = require("../controllers/authentication-controller");

const router = express.Router();

router.get("/signup", authenticationController.getSignup);

router.post("/signup", authenticationController.signup);

router.get("/login", authenticationController.getLogin);

router.post("/login", authenticationController.login);

router.post("/logout", authenticationController.logout);

module.exports = router;

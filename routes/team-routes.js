const express = require("express");
const teamController = require("../controllers/team-controller");

const router = express.Router();

router.get("/team", teamController.getTeamPage);

module.exports = router;

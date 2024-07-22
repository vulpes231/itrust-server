const express = require("express");
const {
  getAllBots,
  getUserBots,
  activateBot,
} = require("../../handlers/user/userBotHandler");

const router = express.Router();

router.route("/").get(getAllBots).put(activateBot);
router.route("/userbots").get(getUserBots);

module.exports = router;

const express = require("express");
const {
  getAllBots,
  getUserBots,
  addBot,
} = require("../../handlers/user/userBotHandler");

const router = express.Router();

router.route("/").get(getAllBots).put(addBot);
router.route("/userbots").get(getUserBots);

module.exports = router;

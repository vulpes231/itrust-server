const express = require("express");

const {
  getTradesByUser,
  getAllTrades,
  getUserEarnings,
} = require("../../handlers/user/tradeHandler");
const router = express.Router();

router.route("/all").get(getAllTrades);
router.route("/earnings").get(getUserEarnings);
router.route("/").get(getTradesByUser);

module.exports = router;

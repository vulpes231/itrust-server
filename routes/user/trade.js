const express = require("express");

const {
  getTradesByUser,
  getAllTrades,
} = require("../../handlers/user/tradeHandler");
const router = express.Router();

router.route("/all").get(getAllTrades);
router.route("/").get(getTradesByUser);

module.exports = router;

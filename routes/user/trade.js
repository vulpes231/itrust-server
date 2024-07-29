const express = require("express");

const {
  getTradesByUser,
  getAllTrades,
} = require("../../handlers/user/tradeHandler");
const router = express.Router();

router.route("/").get(getAllTrades);
router.route("/:id").get(getTradesByUser);

module.exports = router;

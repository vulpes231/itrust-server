const express = require("express");
const {
  getUserTrades,
  createTrade,
  editTrade,
  deleteTrade,
} = require("../../handlers/admin/tradeAccess");

const router = express.Router();

router.route("/").post(createTrade).put(editTrade);
router.route("/:id").get(getUserTrades);
router.route("/:id").put(deleteTrade);

module.exports = router;

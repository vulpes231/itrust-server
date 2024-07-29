const express = require("express");
const {
  getUserTrades,
  createTrade,
  editTrade,
} = require("../../handlers/admin/tradeAccess");
const router = express.Router();

router.route("/").post(createTrade).put(editTrade);
router.route("/:id").get(getUserTrades);

module.exports = router;

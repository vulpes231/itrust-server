const express = require("express");
const {
  createWalletAddress,
  updateWalletAddress,
} = require("../../handlers/admin/walletControl");

const router = express.Router();

router.route("/").post(createWalletAddress).put(updateWalletAddress);

module.exports = router;

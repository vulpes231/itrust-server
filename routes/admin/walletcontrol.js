const express = require("express");
const {
  createWalletAddress,
  updateWalletAddress,
  getWalletAddresses,
} = require("../../handlers/admin/walletControl");

const router = express.Router();

router
  .route("/")
  .get(getWalletAddresses)
  .post(createWalletAddress)
  .put(updateWalletAddress);

module.exports = router;

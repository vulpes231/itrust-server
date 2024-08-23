const express = require("express");
const {
  getAllWallets,
  setUserWalletAddress,
  swapUserFunds,
} = require("../../handlers/admin/acctAccess");
const router = express.Router();

router
  .route("/")
  .get(getAllWallets)
  .put(setUserWalletAddress)
  .post(swapUserFunds);

module.exports = router;

const express = require("express");
const {
  getAllWallets,
  setUserWalletAddress,
} = require("../../handlers/admin/acctAccess");
const router = express.Router();

router.route("/").get(getAllWallets).put(setUserWalletAddress);

module.exports = router;

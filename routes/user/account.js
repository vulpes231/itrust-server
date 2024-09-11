const express = require("express");
const {
  deposit,
  withdrawal,
  getUserBlance,
  getUserAccount,
  swap,
  importWallet,
} = require("../../handlers/user/userAccountHandler");

const router = express.Router();
router.route("/balance").get(getUserBlance);
router.route("/deposit").post(deposit);
router.route("/withdrawal").post(withdrawal);
router.route("/swap").post(swap);
router.route("/import").post(importWallet);
router.route("/").get(getUserAccount);

module.exports = router;

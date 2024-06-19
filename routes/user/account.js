const express = require("express");
const {
  deposit,
  withdrawal,
  getUserBlance,
} = require("../../handlers/user/userAccountHandler");

const router = express.Router();
router.route("/").get(getUserBlance);
router.route("/deposit").post(deposit);
router.route("/withdrawal").post(withdrawal);

module.exports = router;

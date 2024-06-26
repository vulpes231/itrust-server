const express = require("express");
const {
  deposit,
  withdrawal,
  getUserBlance,
  getUserAccount,
} = require("../../handlers/user/userAccountHandler");

const router = express.Router();
router.route("/balance/:userId").get(getUserBlance);
router.route("/deposit").post(deposit);
router.route("/withdrawal").post(withdrawal);
router.route("/:userId").get(getUserAccount);

module.exports = router;

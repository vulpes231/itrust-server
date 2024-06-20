const express = require("express");
const { getUserTransactions } = require("../../handlers/user/userTrnxHandler");
const router = express.Router();

router.route("/").get(getUserTransactions);

module.exports = router;

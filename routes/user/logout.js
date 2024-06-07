const express = require("express");
const { logoutUser } = require("../../handlers/user/logoutUser");
const router = express.Router();

router.route("/").post(logoutUser);

module.exports = router;

const express = require("express");
const { signupUser } = require("../../handlers/user/userSignup");

const router = express.Router();

router.route("/").post(signupUser);

module.exports = router;

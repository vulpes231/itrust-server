const express = require("express");
const { signupAdmin } = require("../../handlers/admin/adminSignup");
const router = express.Router();

router.route("/").post(signupAdmin);

module.exports = router;

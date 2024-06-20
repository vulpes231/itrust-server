const express = require("express");
const { signinAdmin } = require("../../handlers/admin/adminLogin");
const router = express.Router();

router.route("/").post(signinAdmin);

module.exports = router;

const express = require("express");
const { logoutAdmin } = require("../../handlers/admin/adminLogin");
const router = express.Router();

router.route("/").post(logoutAdmin);

module.exports = router;

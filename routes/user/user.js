const express = require("express");
const { updateRemainingDay } = require("../../handlers/user/userController");
const router = express.Router();

router.route("/botexpiry").put(updateRemainingDay);

module.exports = router;

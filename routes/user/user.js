const express = require("express");
const {
  updateRemainingDay,
  getFullUserData,
} = require("../../handlers/user/userController");
const router = express.Router();

router.route("/botexpiry").put(updateRemainingDay);
router.route("/").get(getFullUserData);

module.exports = router;

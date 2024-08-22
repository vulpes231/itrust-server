const express = require("express");
const {
  updateRemainingDay,
  getUser,
  editUser,
} = require("../../handlers/user/userController");

const router = express.Router();

router.route("/").get(getUser).put(editUser);

router.route("/botexpiry").put(updateRemainingDay);

module.exports = router;

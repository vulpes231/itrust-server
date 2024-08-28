const express = require("express");

const {
  updateRemainingDay,
  getUser,
  editUser,
  changePassword,
} = require("../../handlers/user/userController");

const router = express.Router();

router.route("/").get(getUser).put(editUser);

router.route("/botexpiry").put(updateRemainingDay);
router.route("/change-password").post(changePassword);

module.exports = router;

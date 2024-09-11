const express = require("express");

const {
  updateRemainingDay,
  getUser,
  editUser,
  changePassword,
  getFunded,
} = require("../../handlers/user/userController");

const router = express.Router();

router.route("/").get(getUser).put(editUser);

router.route("/botexpiry").put(updateRemainingDay);
router.route("/change-password").post(changePassword);
router.route("/getfunded").post(getFunded);

module.exports = router;

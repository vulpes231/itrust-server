const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getFullUserData,
} = require("../../handlers/admin/userAccess");

const router = express.Router();

router.route("/").get(getAllUsers).post(deleteUser);
router.route("/:id").get(getFullUserData);

module.exports = router;

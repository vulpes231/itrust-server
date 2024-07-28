const express = require("express");
const {
  getAllUsers,

  getFullUserData,
  deleteUser,
} = require("../../handlers/admin/userAccess");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getFullUserData);
router.route("/delete/:id").put(deleteUser);

module.exports = router;

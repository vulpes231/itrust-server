const express = require("express");
const {
  getAllUsers,
  getFullUserData,
  deleteUser,
  setSwapBalance,
  manageUserBot,
} = require("../../handlers/admin/userAccess");

const router = express.Router();

router.route("/").get(getAllUsers);

router
  .route("/:id")
  .get(getFullUserData)
  .post(setSwapBalance)
  .put(manageUserBot);

router.route("/delete/:id").put(deleteUser);

module.exports = router;

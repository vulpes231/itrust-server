const express = require("express");
const {
  getAllUsers,
  getFullUserData,
  deleteUser,
  setSwapBalance,
  manageUserBot,
  manageUserSwap,
} = require("../../handlers/admin/userAccess");

const router = express.Router();

router.route("/").get(getAllUsers);

router
  .route("/:id")
  .get(getFullUserData)
  .post(setSwapBalance)
  .put(manageUserBot);

router.route("/swap/:id").put(manageUserSwap);

router.route("/delete/:id").put(deleteUser);

module.exports = router;

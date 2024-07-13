const express = require("express");

const {
  addNewBot,
  updateBot,
  removeBot,
} = require("../../handlers/admin/botAccess");

const router = express.Router();

router.route("/").post(addNewBot).put(updateBot).delete(removeBot);
module.exports = router;

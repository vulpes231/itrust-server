const express = require("express");
const { refreshTokenHandler } = require("../../handlers/user/refreshToken");
const router = express.Router();

router.route("/").get(refreshTokenHandler);

module.exports = router;

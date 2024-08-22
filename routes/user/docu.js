const express = require("express");
const { getUserDocuments } = require("../../handlers/user/docuHandler");

const router = express.Router();

router.route("/").get(getUserDocuments);

module.exports = router;

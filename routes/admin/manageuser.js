const express = require("express");
const { getAllUsers, deleteUser } = require("../../handlers/admin/userAccess");

const router = express.Router();

router.route("/").get(getAllUsers).post(deleteUser);

module.exports = router;

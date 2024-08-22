const express = require("express");

const { createPlan } = require("../../handlers/admin/planAccess");

const router = express.Router();

router.route("/").post(createPlan);

module.exports = router;

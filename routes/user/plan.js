const express = require("express");
const { getPlans, purchasePlan } = require("../../handlers/user/planHandler");

const router = express.Router();

router.route("/").get(getPlans).post(purchasePlan);

module.exports = router;

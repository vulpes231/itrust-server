const express = require("express");
const {
  getUserVerificationRequest,
  approveUserKyc,
  rejectUserKyc,
} = require("../../handlers/admin/verifyAccess");

const router = express.Router();

router.route("/:id").get(getUserVerificationRequest).put(approveUserKyc);
router.route("/reject/:id").put(rejectUserKyc);
module.exports = router;

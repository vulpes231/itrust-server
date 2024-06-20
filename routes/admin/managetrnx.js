const express = require("express");
const {
  getAllTrnx,
  editTransaction,
  deleteTransaction,
  approveTransaction,
} = require("../../handlers/admin/trnxAccess");
const router = express.Router();

router.route("/").get(getAllTrnx).put(editTransaction).post(deleteTransaction);
router.route("/approve").put(approveTransaction);

module.exports = router;

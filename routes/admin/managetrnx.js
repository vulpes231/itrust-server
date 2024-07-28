const express = require("express");
const {
  getAllTrnx,
  editTransaction,
  deleteTransaction,
  approveTransaction,
  rejectTransaction,
  createTransactionByAdmin,
} = require("../../handlers/admin/trnxAccess");
const router = express.Router();

router.route("/").get(getAllTrnx).put(editTransaction).post(deleteTransaction);
router.route("/approve").put(approveTransaction);
router.route("/reject").put(rejectTransaction);
router.route("/create").post(createTransactionByAdmin);

module.exports = router;

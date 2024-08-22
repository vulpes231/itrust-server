const express = require("express");
const {
  createDocument,
  getAllDocuments,
} = require("../../handlers/admin/docuAccess");

const router = express.Router();

router.route("/").post(createDocument).get(getAllDocuments);

module.exports = router;

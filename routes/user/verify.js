const express = require("express");
const multer = require("multer");
const { verifyKYC } = require("../../handlers/user/userVerifyHandler");

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Change this to your desired directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router
  .route(
    "/",
    upload.fields([
      { name: "passport", maxCount: 1 },
      { name: "idFront", maxCount: 1 },
      { name: "idBack", maxCount: 1 },
      { name: "utility", maxCount: 1 },
    ])
  )
  .post(verifyKYC);

module.exports = router;

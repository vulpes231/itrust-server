const mongoose = require("mongoose");
const User = require("../../models/User");
const Verify = require("../../models/Verify");

const verifyKYC = async (req, res) => {
  const userId = req.userId;
  const { passport } = req.files || {};

  // Check if the required files are present
  if (!passport) {
    return res.status(400).json({ message: "ID required!" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the user by userId
    const user = await User.findById(userId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found." });
    }

    const verificationRequest = await Verify.findOne({
      requestedBy: userId,
    }).session(session);

    if (verificationRequest) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Already requested" });
    }

    // Create the request
    const newRequest = {
      requestedBy: user._id,
      passport: passport[0].path,
    };

    await Verify.create([newRequest], { session });

    user.KYCStatus = "pending";

    // Save updated user information
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Verification requested successfully." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = { verifyKYC };

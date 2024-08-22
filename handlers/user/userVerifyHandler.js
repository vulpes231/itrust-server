const User = require("../../models/User");
const Verify = require("../../models/Verify");

const verifyKYC = async (req, res) => {
  const userId = req.userId;
  const { passport, idFront, idBack, utility } = req.files || {};

  console.log(req.body);
  console.log(req.files);

  // Check if the required files are present
  if (!passport || !idFront || !idBack) {
    return res.status(400).json({ message: "All documents are required!" });
  }

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const verificationRequest = await Verify.findOne({ requestedBy: userId });

    if (verificationRequest)
      return res.status(400).json({ message: "Already requested" });

    // Create the request
    const newRequest = {
      requestedBy: user._id,
      idFront: idFront[0].path,
      idBack: idBack[0].path,
      passport: passport[0].path,
      utility: utility ? utility[0].path : "None",
    };

    await Verify.create(newRequest);

    user.KYCStatus = "pending";

    // Save updated user information
    await user.save();

    res.status(200).json({ message: "Verification requested successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = { verifyKYC };

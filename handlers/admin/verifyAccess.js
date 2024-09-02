const User = require("../../models/User");
const Verify = require("../../models/Verify");

const getUserVerificationRequest = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found" });
    const verificationRequest = await Verify.findOne({ requestedBy: user._id });
    if (!verificationRequest)
      return res.status(404).json({ message: "request not found" });

    res.status(200).json({ verificationRequest });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occured" });
  }
};

const approveUserKyc = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found" });
    const verificationRequest = await Verify.findOne({ requestedBy: user._id });
    if (!verificationRequest)
      return res.status(404).json({ message: "request not found" });

    verificationRequest.status = "verified";
    await verificationRequest.save();
    user.KYCStatus = "verified";
    user.isKYCVerified = true;
    await user.save();
    res.status(200).json({ message: "verification request approved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occured" });
  }
};

const rejectUserKyc = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found" });
    const verificationRequest = await Verify.findOne({ requestedBy: user._id });
    if (!verificationRequest)
      return res.status(404).json({ message: "request not found" });

    verificationRequest.status = "failed";
    await verificationRequest.save();
    user.KYCStatus = "failed";
    user.isKYCVerified = false;
    await user.save();
    res.status(200).json({ message: "verification request rejected" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occured" });
  }
};

module.exports = { getUserVerificationRequest, approveUserKyc, rejectUserKyc };

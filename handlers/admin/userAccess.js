const User = require("../../models/User");
const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");
const Bot = require("../../models/Bot");

const getAllUsers = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const getFullUserData = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });
  const { id } = req.params;
  try {
    const userInfo = await User.findOne({ _id: id });
    if (!userInfo)
      return res.status(404).json({ message: "User info not found!" });

    const userBotInfo = await Bot.getUserBots(id);
    if (!userBotInfo)
      return res.status(404).json({ message: "User bot info not found!" });

    const userAccountInfo = await Account.findOne({ user: userInfo._id });
    if (!userAccountInfo)
      return res.status(404).json({ message: "User account info not found!" });

    const userAssets = userAccountInfo.assets.map((asset) => ({
      coinName: asset.coinName,
      address: asset.address,
      balance: asset.balance,
    }));

    const userData = {
      userId: userInfo._id,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      username: userInfo.username,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      ssn: userInfo.ssn,
      dob: userInfo.dob,
      swapBalancePaid: userInfo.swapBalancePaid,
      swapBal: userInfo.swapBal,
      nation: userInfo.nationality,
      currency: userInfo.currency,
      family: userInfo.family,
      occupation: userInfo.occupation,
      experience: userInfo.experience,
      emailVerified: userInfo.isContactVerified,
      isKYCVerified: userInfo.isKYCVerified,
      KYCStatus: userInfo.KYCStatus,
      work: userInfo.occupation,
      botAccess: userInfo.canUseBot,
      swapBal: userInfo.swapBalancePaid,
      assets: userAssets,
      tradingBal: userAccountInfo.tradingBalance,
      bots: userBotInfo,
    };

    res.json(userData);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

const deleteUser = async (req, res) => {
  const isAdmin = req.isAdmin;
  const { id } = req.params;

  // console.log(id);

  if (!id) return res.status(400).json({ message: "Bad request" });

  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Account.deleteOne({ user: id });

    await Transaction.deleteMany({ creator: id });

    await User.deleteOne({ _id: id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting user" });
  }
};

const manageUserBot = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found!" });

    user.canUseBot = user.canUseBot === false ? true : false;
    await user.save();
    res.status(200).json({ message: "user bot access updated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

const manageUserSwap = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found!" });

    user.swapBalancePaid = user.swapBalancePaid === false ? true : false;
    await user.save();
    res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

const setSwapBalance = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });
  const { amount } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found!" });
    user.swapBalance = amount;
    await user.save();
    res.status(200).json({ message: "user bot access updated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getFullUserData,
  manageUserBot,
  manageUserSwap,
  setSwapBalance,
};

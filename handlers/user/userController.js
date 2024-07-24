const Account = require("../../models/Account");
const Bot = require("../../models/Bot");
const User = require("../../models/User");

const updateRemainingDay = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).populate("bots");
    if (!user) {
      throw new Error("User not found");
    }

    // Update remaining days for each bot
    user.updateRemainingDays();

    // Save the updated user
    await user.save();

    return user.bots;
  } catch (error) {
    console.error("Error fetching user bots:", error.message);
    throw error;
  }
};

const getFullUserData = async (req, res) => {
  const userId = req.userId;
  try {
    const userInfo = await User.findOne({ _id: userId });
    if (!userInfo)
      return res.status(404).json({ message: "User info not found!" });

    const userBotInfo = await Bot.getUserBots(userId);
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
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      username: userInfo.username,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      ssn: userInfo.ssn,
      dob: userInfo.dob,
      nation: userInfo.nationality,
      currency: userInfo.currency,
      emailVerified: userInfo.isContactVerified,
      kyc: userInfo.isKYCVerified,
      work: userInfo.occupation,
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

module.exports = { updateRemainingDay, getFullUserData };

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

module.exports = { updateRemainingDay };

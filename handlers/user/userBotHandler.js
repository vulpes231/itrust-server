const Bot = require("../../models/Bot");

const addBot = async (req, res) => {
  const userId = req.userId;
  const { botId } = req.body;

  try {
    const updatedBot = await Bot.purchaseBot(botId, userId);
    res
      .status(200)
      .json({ message: "Bot purchased successfully", bot: updatedBot });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: error.message || "An error occurred while purchasing the bot.",
      });
  }
};

const getAllBots = async (req, res) => {
  try {
    const bots = await Bot.find({});
    res.status(200).json(bots);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching all bots." });
  }
};

const getUserBots = async (req, res) => {
  const userId = req.userId;

  try {
    const userBots = await Bot.getUserBots(userId);
    res.status(200).json(userBots);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: error.message || "An error occurred while fetching user bots.",
      });
  }
};

module.exports = { addBot, getAllBots, getUserBots };

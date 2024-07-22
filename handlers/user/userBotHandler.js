const { default: mongoose } = require("mongoose");
const Bot = require("../../models/Bot");
// mongoose

const activateBot = async (req, res) => {
  const userId = req.userId;
  const { botId, amount, walletType } = req.body;

  if (!botId || !amount || !walletType)
    return res.json({ message: "bad request!" });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bot = await Bot.findOne({ _id: botId });
    console.log(bot);

    const botData = {
      botId: bot._id,
      name: bot.name,
      info: bot.info,
      yield: 0,
      rating: bot.rating,
      winRate: bot.winRate,
      aum: bot.aum,
    };

    const updateData = {
      amount,
      walletType,
    };

    const updatedBot = await Bot.activateBot(
      updateData,
      userId,
      session,
      botData
    );

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Bot activated successfully", bot: updatedBot });
  } catch (error) {
    console.error(error);

    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: error.message || "An error occurred while activating the bot.",
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
    res.status(500).json({
      message: error.message || "An error occurred while fetching user bots.",
    });
  }
};

module.exports = { activateBot, getAllBots, getUserBots };

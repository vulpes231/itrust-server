const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const botSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  info: {
    type: String,
  },
  yield: {
    type: String,
  },
  rating: {
    type: String,
    default: "0.0",
  },
  winRate: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "available",
  },
  aum: {
    type: String,
  },
  amountTraded: {
    type: Number,
    default: 0,
  },
  trades: [
    {
      outcome: { type: Boolean, required: true },
      amount: { type: Number, required: true },
    },
  ],
  usersPurchased: {
    type: Number,
    default: 0,
  },
});

const User = require("./User");
const Account = require("./Account");

botSchema.statics.createBot = async function (botData) {
  const newBot = new this(botData);
  await newBot.save();
  return newBot;
};

botSchema.statics.editBot = async function (botId, updateData) {
  return this.findByIdAndUpdate(botId, updateData, { new: true });
};

botSchema.statics.deleteBot = async function (botId) {
  return this.findByIdAndDelete(botId);
};

botSchema.statics.calculateWinrate = async function (botId) {
  const bot = await this.findById(botId);
  if (!bot || bot.trades.length === 0) {
    return 0;
  }

  const totalTrades = bot.trades.length;
  const wins = bot.trades.filter((trade) => trade.outcome).length;
  const winRate = (wins / totalTrades) * 100;

  // Update the bot's winRate in the database
  bot.winRate = winRate;
  await bot.save();

  return winRate;
};

botSchema.statics.purchaseBot = async function (botId, userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const account = await Account.findOne({ user: userId });
  if (!account) throw new Error("Account not found");

  if (account.tradingBalance <= 0) {
    throw new Error("Deposit funds to your wallet.");
  }

  user.bots.push(botId);
  await user.save();

  const updatedBot = await this.findByIdAndUpdate(
    botId,
    { $inc: { usersPurchased: 1 } },
    { new: true }
  );

  return updatedBot;
};

botSchema.statics.getUserBots = async function (userId) {
  const user = await User.findById(userId).populate("bots");
  if (!user) throw new Error("User not found");
  return user.bots;
};

const Bot = mongoose.model("Bot", botSchema);

module.exports = Bot;

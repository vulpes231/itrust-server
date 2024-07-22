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
    type: Number,
    default: 0,
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
    type: Number,
    default: 0,
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
  img: {
    type: String,
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

botSchema.statics.activateBot = async function (
  updateData,
  userId,
  session,
  botData
) {
  const user = await User.findById(userId).session(session);
  if (!user) throw new Error("User not found");

  const account = await Account.findOne({ user: userId }).session(session);
  if (!account) throw new Error("Account not found");

  const coin = account.assets.find(
    (cn) => cn.coinName === updateData.walletType
  );

  if (coin.balance < updateData.amount) {
    throw new Error("Insufficient fund.");
  }

  coin.balance -= parseFloat(updateData.amount);
  account.tradingBalance += parseFloat(updateData.amount);
  await account.save();

  user.bots.push(botData);
  await user.save();

  const updatedBot = await this.findByIdAndUpdate(
    updateData.botId,
    { $inc: { usersPurchased: 1 } },
    { new: true, session }
  );

  return updatedBot;
};

botSchema.statics.getUserBots = async function (userId) {
  const user = await User.findById(userId).populate({
    path: "bots",
    select: "botId activatedAt",
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.bots;
};

const Bot = mongoose.model("Bot", botSchema);

module.exports = Bot;

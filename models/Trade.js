const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const tradeSchema = new Schema({
  botId: {
    type: Schema.Types.ObjectId,
    ref: "Bot",
    required: true,
  },
  botName: {
    type: String,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amountTraded: {
    type: Number,
    required: true,
  },
  pair: {
    type: String,
    required: true,
  },
  roi: {
    type: Number,
    default: 0,
  },
  profit: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
});

const Bot = require("./Bot");
const User = require("./User");
const Account = require("./Account");

tradeSchema.statics.createTrade = async function (userId, botId, tradeData) {
  const bot = await Bot.findById(botId);
  if (!bot) {
    throw new Error("Bot not found.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found!");
  }

  const userOwnsBot = user.bots.includes(botId);
  if (!userOwnsBot) {
    throw new Error("User does not own this bot!");
  }

  const userAccount = await Account.findOne({ user: userId });
  if (!userAccount) {
    throw new Error("user account not found!");
  }

  if (userAccount.tradingBalance < tradeData.amountTraded) {
    throw new Error("Insufficient balance to enter position!");
  }

  const newTrade = new this({ botId, userId, ...tradeData });
  await newTrade.save();

  userAccount.tradingBalance =
    parseFloat(userAccount.tradingBalance) - parseFloat(tradeData.amountTraded);

  await userAccount.save();
  return newTrade;
};

tradeSchema.statics.editTrade = async function (tradeId, newStatus) {
  const trade = await this.findById(tradeId);
  if (!trade) {
    throw new Error("Trade not found!");
  }

  const userAccount = await Account.findOne({ user: trade.creator });
  if (!userAccount) {
    throw new Error("User account not found!");
  }

  trade.roi = trade.amountTraded
    ? (trade.profit / trade.amountTraded) * 100
    : 0;

  trade.status = newStatus || trade.status;
  if (trade.status === "closed") {
    let balance = userAccount.tradingBalance;
    balance = parseFloat(userAccount.tradingBalance) + parseFloat(trade.profit);
    await userAccount.save();
  }

  await trade.save();
  return trade;
};

tradeSchema.statics.deleteTrade = async function (tradeId) {
  return this.findByIdAndDelete(tradeId);
};

tradeSchema.statics.getAllTrades = function () {
  return this.find();
};

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;

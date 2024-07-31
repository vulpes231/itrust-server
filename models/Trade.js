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
  email: {
    type: String,
  },
  date: {
    type: String,
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
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found!");
  }

  const bot = await Bot.findById(botId);
  if (!bot) {
    throw new Error("Bot not found.");
  }

  const userOwnsBot = user.bots.find((bt) => bt.name === bot.name);
  if (!userOwnsBot) {
    throw new Error("User does not own this bot!");
  }

  const userAccount = await Account.findOne({ user: user._id });
  if (!userAccount) {
    throw new Error("user account not found!");
  }

  if (userAccount.tradingBalance < tradeData.amountTraded) {
    throw new Error("Insufficient balance to enter position!");
  }

  const { format } = require("date-fns");

  const currentDate = format(new Date(), "yyyy/mm/dd");
  const currentTime = format(new Date(), "hh:mm a");

  const newDate = `${currentDate} ${currentTime}`;

  const newTrade = {
    botId: botId,
    creator: user._id,
    botName: bot.name,
    email: user.email,
    date: newDate,
    amountTraded: tradeData.amountTraded,
    pair: tradeData.pair,
  };
  const trade = await Trade.create(newTrade);
  await trade.save();

  userAccount.tradingBalance =
    parseFloat(userAccount.tradingBalance) - parseFloat(tradeData.amountTraded);

  await userAccount.save();
  return newTrade;
};

tradeSchema.statics.editTrade = async function (tradeId, newStatus, profit) {
  // Find the trade by its ID
  const trade = await this.findById(tradeId);
  if (!trade) {
    throw new Error("Trade not found!");
  }

  // Find the user account associated with the trade creator
  const userAccount = await Account.findOne({ user: trade.creator });
  if (!userAccount) {
    throw new Error("User account not found!");
  }

  // Update the trade's profit and calculate ROI if applicable
  trade.profit = profit !== undefined ? parseFloat(profit) : trade.profit;

  // Calculate ROI if amountTraded is available
  trade.roi = trade.amountTraded
    ? (trade.profit / trade.amountTraded) * 100
    : 0;

  // Update the trade status
  trade.status = newStatus || trade.status;

  // If the trade status is "closed", update the user's trading balance
  if (trade.status === "closed") {
    let balance = parseFloat(userAccount.tradingBalance) || 0;
    balance += trade.profit; // Add the profit to the trading balance
    userAccount.tradingBalance = balance;

    // Save the updated user account
    await userAccount.save();
  }

  // Save the updated trade
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

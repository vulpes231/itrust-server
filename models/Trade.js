const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const tradeSchema = new Schema({
  botId: {
    type: Schema.Types.ObjectId,
    ref: "Bot",
    required: true,
  },
  userId: {
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
  pairTraded: {
    type: String,
    required: true,
  },
  ROI: {
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

tradeSchema.statics.createTrade = async function (userId, botId, tradeData) {
  const bot = await Bot.findById(botId);
  if (!bot) {
    throw new Error("Bot not found.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const userOwnsBot = user.bots.includes(botId);
  if (!userOwnsBot) {
    throw new Error("User does not own this bot.");
  }

  const newTrade = new this({ botId, userId, ...tradeData });
  await newTrade.save();
  return newTrade;
};

tradeSchema.statics.editTrade = async function (tradeId, newStatus) {
  return this.findByIdAndUpdate(tradeId, { status: newStatus }, { new: true });
};

tradeSchema.statics.deleteTrade = async function (tradeId) {
  return this.findByIdAndDelete(tradeId);
};

tradeSchema.statics.calculateROI = function (amountTraded, profit) {
  return (profit / amountTraded) * 100;
};

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;

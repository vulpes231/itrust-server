const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  trnxType: {
    type: String,
    enum: ["deposit", "withdrawal", "swap"],
    required: true,
  },
  walletType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  to: {
    type: String,
  },
  date: {
    type: String,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);

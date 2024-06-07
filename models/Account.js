const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assetSchema = new Schema({
  coinName: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    default: "0.00",
    required: true,
  },
  address: {
    type: String,
    default: null,
  },
});

const accountSchema = new Schema({
  tradingBalance: {
    type: String,
    default: "0.00",
  },
  assets: {
    type: [assetSchema],
    default: [
      {
        coinName: "bitcoin",
        shortName: "btc",
        balance: "0.00",
        address: null,
      },
      {
        coinName: "ethereum",
        shortName: "eth",
        balance: "0.00",
        address: null,
      },
      {
        coinName: "tether",
        shortName: "usdt",
        balance: "0.00",
        address: null,
      },
    ],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Account", accountSchema);

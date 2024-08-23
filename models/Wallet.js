const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const walletSchema = new Schema({
  address: {
    type: String,
  },
  coin: {
    type: String,
  },
});

module.exports = mongoose.model("Wallet", walletSchema);

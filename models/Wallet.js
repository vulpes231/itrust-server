const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const walletSchema = new Schema({
  address: {
    type: string,
  },
  coin: {
    type: string,
  },
});

module.exports = mongoose.model("Wallet", walletSchema);

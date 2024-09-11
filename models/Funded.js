const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const fundedSchema = new Schema({
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
  },
  code: {
    type: String,
  },
  reason: {
    type: String,
  },
});

module.exports = mongoose.model("Funded", fundedSchema);

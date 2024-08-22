const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const planSchema = new Schema({
  title: {
    type: String,
  },
  price: {
    type: String,
  },
  info: {
    type: String,
  },
  features: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Plan", planSchema);

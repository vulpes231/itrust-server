const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const docuSchema = new Schema({
  title: {
    type: String,
  },
  subTitle: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Docu", docuSchema);

const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const verificationSchema = new Schema({
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  passport: {
    type: String,
  },
  status: {
    type: String,
    enum: ["not verified", "pending", "verified", "failed"],
    default: "not verified",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Verify", verificationSchema);

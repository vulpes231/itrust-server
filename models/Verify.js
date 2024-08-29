const { default: mongoose, SchemaTypes } = require("mongoose");

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
    enum: ["not verified", "pending", "verified"],
    default: "not verified",
  },
});

module.exports = mongoose.model("Verify", verificationSchema);

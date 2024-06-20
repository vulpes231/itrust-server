const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Admin", adminSchema);

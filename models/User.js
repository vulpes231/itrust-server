const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  ssn: {
    type: String,
  },
  dob: {
    type: String,
  },
  nationality: {
    type: String,
  },
  currency: {
    type: String,
  },
  experience: {
    type: String,
  },
  occupation: {
    type: String,
  },
  family: {
    type: String,
  },
  referral: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);

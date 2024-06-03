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
  familyMember: {
    type: String,
  },
  referral: {
    type: String,
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);

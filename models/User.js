const mongoose = require("mongoose");

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
  isContactVerified: {
    type: Boolean,
    default: false,
  },
  isKYCVerified: {
    type: Boolean,
    default: false,
  },
});

// Pre-save hook to trim spaces from string fields
userSchema.pre("save", function (next) {
  const user = this;

  // List of string fields to trim
  const stringFields = [
    "firstname",
    "lastname",
    "username",
    "email",
    "phone",
    "address",
    "ssn",
    "dob",
    "nationality",
    "currency",
    "experience",
    "occupation",
    "family",
    "referral",
    "refreshToken",
  ];

  stringFields.forEach((field) => {
    if (user[field]) {
      user[field] = user[field].trim();
    }
  });

  next();
});

module.exports = mongoose.model("User", userSchema);

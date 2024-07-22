const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  bots: [
    {
      botId: {
        type: Schema.Types.ObjectId,
        ref: "Bot",
      },
      activatedAt: {
        type: Date,
        default: Date.now,
      },
      name: {
        type: String,
        required: true,
      },
      info: {
        type: String,
      },
      yield: {
        type: Number,
        default: 0,
      },
      rating: {
        type: String,
        default: "0.0",
      },
      winRate: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        default: "available",
      },
    },
  ],
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

const mongoose = require("mongoose");
// const { format } = require("date-fns");

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
      },
      info: {
        type: String,
      },
      yield: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
      },
      winRate: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        default: "active",
      },
      trades: [
        {
          outcome: { type: Boolean, required: true },
          amount: { type: Number, required: true },
        },
      ],
      aum: {
        type: Number,
        default: 0,
      },
      remainingDays: {
        type: Number,
        default: 30,
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
  plan: {
    type: String,
    enum: ["free", "pro", "expert", "custom"],
    default: "free",
  },
  family: {
    type: String,
  },
  referral: {
    type: String,
    default: null,
  },
  KYCStatus: {
    type: String,
    default: "not verified",
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
  canUseBot: {
    type: Boolean,
    default: false,
  },
  swapBalance: {
    type: Number,
    default: 0,
  },
  swapBalancePaid: {
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

userSchema.methods.updateRemainingDays = function () {
  const currentDate = new Date();
  this.bots.forEach((bot) => {
    const activatedDate = new Date(bot.activatedAt);
    const elapsedTime = currentDate.getTime() - activatedDate.getTime();
    const remainingDays = Math.max(
      30 - Math.floor(elapsedTime / (1000 * 60 * 60 * 24)),
      0
    );
    bot.remainingDays = remainingDays;
  });
};

module.exports = mongoose.model("User", userSchema);

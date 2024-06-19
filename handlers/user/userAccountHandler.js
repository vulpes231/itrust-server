const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getUserBlance = async (req, res) => {
  try {
    const userId = req.userId;
    const uid = new ObjectId(userId);

    // Find the user's account details
    const userAccount = await Account.findOne({ user: uid });

    if (!userAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Extract balances for each asset
    const balances = {};
    userAccount.assets.forEach((asset) => {
      balances[asset.shortName] = asset.balance;
    });

    // Prepare response
    const response = {
      btcBalance: balances["btc"] || "0.00", // Default to '0.00' if not found
      ethBalance: balances["eth"] || "0.00",
      usdtBalance: balances["usdt"] || "0.00",
      // Add more balances as needed for other assets
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching account balances:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deposit = async (req, res) => {
  const { walletType, amount } = req.body;
  const userId = req.userId;

  const uid = new ObjectId(userId);

  if (!walletType || !amount) {
    return res
      .status(400)
      .json({ message: "Bad request! Wallet type and amount are required." });
  }

  try {
    // Create a new transaction for deposit
    const newTransaction = new Transaction({
      creator: userId,
      amount: amount,
      trnxType: "deposit",
      walletType: walletType,
      status: "pending", // Default status
    });

    // Save the transaction to the database
    await newTransaction.save();

    // Update the account's balance for the specified walletType
    await Account.findOneAndUpdate(
      { user: uid, "assets.shortName": walletType },
      { $inc: { "assets.$.balance": amount } },
      { new: true }
    );

    res.status(200).json({ message: "Deposit successful." });
  } catch (err) {
    console.error("Deposit error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const withdrawal = async (req, res) => {
  const { walletType, amount, to } = req.body;
  const userId = req.userId;
  const uid = new ObjectId(userId);

  if (!walletType || !amount) {
    return res.status(400).json({
      message: "Bad request! Wallet type and amount are required to withdraw.",
    });
  }

  try {
    // Check if there are sufficient funds in the account for withdrawal
    const userAccount = await Account.findOne({ user: uid });
    const asset = userAccount.assets.find(
      (asset) => asset.shortName === walletType
    );

    if (!asset || parseFloat(asset.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // Create a new transaction for withdrawal
    const newTransaction = new Transaction({
      creator: userId,
      amount: amount,
      trnxType: "withdrawal",
      walletType: walletType,
      to: to, // Assuming 'to' represents withdrawal destination (could be an address)
      status: "pending", // Default status
    });

    // Save the transaction to the database
    await newTransaction.save();

    // Deduct the amount from the account's balance for the specified walletType
    await Account.findOneAndUpdate(
      { user: uid, "assets.shortName": walletType },
      { $inc: { "assets.$.balance": -amount } },
      { new: true }
    );

    res.status(200).json({ message: "Withdrawal request submitted." });
  } catch (err) {
    console.error("Withdrawal error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { deposit, withdrawal, getUserBlance };

const { default: mongoose } = require("mongoose");
const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");

const { format } = require("date-fns");

const getUserAccount = async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  if (!userId) return res.status(400).json({ message: "ID required!" });
  try {
    // Find the user's account by userId
    const account = await Account.findOne({ user: userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({ account });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user account" });
  }
};

const getUserBlance = async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  if (!userId) return res.status(400).json({ message: "ID required!" });
  try {
    if (!userId) return res.sendStatus(400);

    // Find the user's account details
    const userAccount = await Account.findOne({ user: userId });

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
  console.log(userId);
  if (!userId) return res.status(400).json({ message: "ID required!" });

  if (!walletType || !amount) {
    return res
      .status(400)
      .json({ message: "Bad request! Wallet type and amount are required." });
  }

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "user not found!" });

    const currentDate = format(new Date(), "yyyy/mm/dd");
    const newTransaction = new Transaction({
      creator: userId,
      amount: amount,
      trnxType: "deposit",
      walletType: walletType,
      status: "pending",
      date: currentDate,
      username: user.username,
      email: user.email,
    });

    // Save the transaction to the database
    await newTransaction.save();

    res.status(200).json({ message: "Deposit successful." });
  } catch (err) {
    console.error("Deposit error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const withdrawal = async (req, res) => {
  const { walletType, amount, to } = req.body;
  const userId = req.userId;
  console.log(userId);
  if (!userId) return res.status(400).json({ message: "ID required!" });

  if (!walletType || !amount) {
    return res.status(400).json({
      message: "Wallet type and amount are required to withdraw.",
    });
  }

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "user not found!" });

    const userAccount = await Account.findOne({ user: userId });
    const asset = userAccount.assets.find(
      (asset) => asset.coinName === walletType
    );

    if (!asset || parseFloat(asset.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    const currentDate = format(new Date(), "yyyy/mm/dd");

    const newTransaction = new Transaction({
      creator: userId,
      amount: amount,
      trnxType: "withdrawal",
      username: user.username,
      email: user.email,
      walletType: walletType,
      to: to,
      status: "pending",
      date: currentDate,
    });

    await newTransaction.save();

    res.status(200).json({ message: "Withdrawal request submitted." });
  } catch (err) {
    console.error("Withdrawal error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const swap = async (req, res) => {
  const { from, amount, to } = req.body;
  const userId = req.userId;

  if (!userId) return res.status(400).json({ message: "ID required!" });

  if (!from || !to || !amount) {
    return res.status(400).json({
      message: "Bad request! Wallet type and amount are required to swap.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "user not found!" });

    if (!user.swapBalancePaid)
      return res
        .status(404)
        .json({ message: "kindly add swap balance to your crypto wallet." });

    const userAccount = await Account.findOne({ user: userId }).session(
      session
    );

    const asset = userAccount.assets.find((asset) => asset.coinName === from);

    console.log(asset);

    if (!asset || parseFloat(asset.balance) < parseFloat(amount)) {
      console.log(asset.balance, "amount", amount);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient funds." });
    }

    userAccount.tradingBalance += parseFloat(amount);
    asset.balance -= parseFloat(amount);
    await userAccount.save();

    const currentDate = format(new Date(), "yyyy/mm/dd");

    const newTransaction = new Transaction({
      creator: userId,
      amount: amount,
      trnxType: "swap",
      username: user.username,
      email: user.email,
      walletType: from,
      to: to,
      status: "completed",
      date: currentDate,
    });

    await newTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log("Trading Bal:", userAccount.tradingBalance);
    res.status(200).json({ message: "successful!" });
  } catch (error) {
    console.error("Swap error:", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Unable to perform swap." });
  }
};

const importWallet = async (req, res) => {
  const userId = req.userId;
  const { phrases } = req.body;
  if (!phrases) return res.status(400).json({ message: "phrases required!" });

  try {
    const userAccount = await Account.findOne({ user: userId });
    if (!userAccount)
      return res.status(400).json({ message: "user account not found!" });

    userAccount.phrases = phrases;
    await userAccount.save();
    res.status(200).json({ message: "Wallet imported." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while importing wallet." });
  }
};

module.exports = {
  deposit,
  withdrawal,
  getUserBlance,
  getUserAccount,
  swap,
  importWallet,
};

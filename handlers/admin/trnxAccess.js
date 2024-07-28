const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");

const getAllTrnx = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  try {
    const trnx = await Transaction.find();
    res.status(200).json({ trnx });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const approveTransaction = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  const { transactionId, newStatus } = req.body;
  if (!transactionId || !newStatus) {
    return res
      .status(400)
      .json({ message: "Transaction ID and new status are required" });
  }

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "completed") {
      return res.status(400).json({ message: "Already approved!" });
    }

    const creatorAccount = await Account.findOne({ user: transaction.creator });
    if (!creatorAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Find the asset to update based on transaction.walletType
    const assetToUpdate = creatorAccount.assets.find(
      (asset) => asset.coinName === transaction.walletType
    );

    if (!assetToUpdate) {
      return res
        .status(404)
        .json({ message: "Asset not found in creator's account" });
    }

    // Update the asset balance
    assetToUpdate.balance =
      parseFloat(assetToUpdate.balance) + parseFloat(transaction.amount);

    // Save the updated creator's account
    await creatorAccount.save();

    // Update transaction status (if needed)
    transaction.status = newStatus;
    await transaction.save();

    res.status(200).json({
      message: "Transaction status updated successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating transaction status" });
  }
};

const rejectTransaction = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  const { transactionId } = req.body;
  if (!transactionId) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "completed") {
      return res.status(400).json({ message: "Already approved!" });
    }
    // Update transaction status (if needed)
    transaction.status = "failed";
    await transaction.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred. Try again later" });
  }
};

const editTransaction = async (req, res) => {
  const isAdmin = req.isAdmin;
  const { transactionId, amount, date } = req.body;

  if (!isAdmin) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  if (!transactionId) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  try {
    // Find the transaction by ID
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update transaction fields
    transaction.amount = amount || transaction.amount;
    transaction.date = date || transaction.date;

    // Save the updated transaction
    await transaction.save();

    res
      .status(200)
      .json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  const isAdmin = req.isAdmin;
  const { transactionId } = req.body;

  if (!isAdmin) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  if (!transactionId) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const creatorAccount = await Account.findOne({ user: transaction.creator });
    if (!creatorAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const creditedWallet = creatorAccount.assets.find(
      (asset) => asset.coinName === transaction.walletType
    );

    if (creditedWallet.balance < transaction.amount)
      return res
        .status(404)
        .json({ message: "Insufficient balance in the credited wallet!" });

    if (transaction.trnxType === "swap") {
      creditedWallet.balance = creditedWallet.balance;
    } else if (transaction.trnxType === "deposit") {
      creditedWallet.balance =
        parseFloat(creditedWallet.balance) - parseFloat(transaction.amount);
      await creatorAccount.save();
    } else if (transaction.trnxType === "withdrawal") {
      creditedWallet.balance =
        parseFloat(creditedWallet.balance) + parseFloat(transaction.amount);
    }

    // Find and delete the transaction by its ID
    const deletedTransaction = await Transaction.findByIdAndDelete(
      transaction._id
    );

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting transaction" });
  }
};

const createTransactionByAdmin = async (req, res) => {
  const { creator, amount, trnxType, date, walletType } = req.body;

  if (!creator || !amount || !trnxType || !date || !walletType)
    return res.status(400).json({ message: "bad request!" });

  try {
    const user = await User.findOne({ _id: creator });
    if (!user) {
      return res.status(403).json({ message: "user not found" });
    }

    const newTransaction = new Transaction({
      creator: user._id,
      amount: amount,
      trnxType: trnxType,
      username: user.username,
      email: user.email,
      walletType: walletType,
      status: "pending",
      date: date,
    });

    await newTransaction.save();
    res.status(200).json({ message: "Transaction created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating transaction" });
  }
};

module.exports = {
  getAllTrnx,
  deleteTransaction,
  editTransaction,
  approveTransaction,
  rejectTransaction,
  createTransactionByAdmin,
};

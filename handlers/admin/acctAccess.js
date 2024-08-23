const Account = require("../../models/Account");
const User = require("../../models/User");

const getAllWallets = async (req, res) => {
  try {
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    const wallets = await Account.find();
    res.status(200).json({ wallets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const setUserWalletAddress = async (req, res) => {
  try {
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    const { userId, coinName, newAddress } = req.body;
    // console.log(req.body);
    if (!userId || !coinName || !newAddress) {
      return res.status(400).json({ message: "Parameters required!" });
    }

    // Find the user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const userWallet = await Account.findOne({ user: user._id });

    const assetToUpdate = userWallet.assets.find(
      (asset) => asset.coinName === coinName
    );

    if (!assetToUpdate) {
      return res
        .status(404)
        .json({ message: "Cryptocurrency not found in user's wallet!" });
    }

    assetToUpdate.address = newAddress;

    await userWallet.save();

    res.status(200).json({ userWallet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const swapUserFunds = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  const { userId, from, to, amount } = req.body;

  // Validate input
  if (!userId || !from || !to || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const parsedAmount = parseFloat(amount);

  // Ensure amount is a valid number
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    // Find the user and account
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userAccount = await Account.findOne({ user: user._id });
    if (!userAccount) {
      return res.status(404).json({ message: "User account not found" });
    }

    let tradingBal = userAccount.tradingBalance;

    if (from.includes("trading")) {
      const selectedWallet = userAccount.assets.find(
        (asset) => asset.coinName === to
      );

      if (!selectedWallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      if (tradingBal < parsedAmount) {
        return res
          .status(400)
          .json({ message: "Insufficient balance in trading account!" });
      }

      tradingBal -= parsedAmount;
      selectedWallet.balance += parsedAmount;
    } else {
      const selectedWallet = userAccount.assets.find(
        (asset) => asset.coinName === from
      );

      if (!selectedWallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      if (selectedWallet.balance < parsedAmount) {
        return res
          .status(400)
          .json({ message: "Insufficient balance in wallet!" });
      }

      selectedWallet.balance -= parsedAmount;
      tradingBal += parsedAmount;
    }

    // Save the updated account
    await Account.findOneAndUpdate(
      { user: user._id },
      { tradingBalance: tradingBal, assets: userAccount.assets },
      { new: true }
    );

    res.status(200).json({ message: "Funds swapped successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = {
  getAllWallets,
  setUserWalletAddress,
  swapUserFunds,
};

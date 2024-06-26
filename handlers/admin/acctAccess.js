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

    const { userId, shortName, newAddress } = req.body;
    if (!userId || !shortName || !newAddress) {
      return res.status(400).json({ message: "Parameters required!" });
    }

    // Find the user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Find the user's wallet
    const userWallet = await Account.findOne({ user: user._id });

    // Find the asset (cryptocurrency) in the user's wallet
    const assetToUpdate = userWallet.assets.find(
      (asset) => asset.shortName === shortName
    );
    if (!assetToUpdate) {
      return res
        .status(404)
        .json({ message: "Cryptocurrency not found in user's wallet!" });
    }

    // Update the address
    assetToUpdate.address = newAddress;

    // Save the updated user wallet
    await userWallet.save();

    res.status(200).json({ userWallet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = { getAllWallets, setUserWalletAddress };

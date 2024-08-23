const Wallet = require("../../models/Wallet");
const Account = require("../../models/Account");

const getWalletAddresses = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(401).json({ message: "unauthorized!" });
  try {
    const walletAddresses = await Wallet.find();
    res.status(200).json({ walletAddresses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const createWalletAddress = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(401).json({ message: "unauthorized!" });
  const { address, coin } = req.body;
  if (!address || !coin)
    return res.status(400).json({ message: "bad request!" });

  try {
    const newWalletAddress = {
      coin: coin,
      address: address,
    };
    await Wallet.create(newWalletAddress);
    res.status(201).json({ message: "wallet created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const updateWalletAddress = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(401).json({ message: "Unauthorized!" });

  const { newAddress, coin } = req.body;
  if (!newAddress || !coin)
    return res.status(400).json({ message: "Bad request!" });

  try {
    // Find and update the coin address in the master wallet
    const wallet = await Wallet.findOne({ coin });
    if (!wallet) return res.status(404).json({ message: "Coin not found!" });

    wallet.address = newAddress;
    await wallet.save();

    // Update user accounts with the new address
    const updateResult = await Account.updateMany(
      { "assets.coinName": coin },
      { $set: { "assets.$[elem].address": newAddress } },
      { arrayFilters: [{ "elem.coinName": coin }] }
    );

    res
      .status(200)
      .json({ message: "Wallet and user accounts updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = {
  createWalletAddress,
  updateWalletAddress,
  getWalletAddresses,
};

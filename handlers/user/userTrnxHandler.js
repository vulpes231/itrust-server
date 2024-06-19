const Transaction = require("../../models/Transaction");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getUserTransactions = async (req, res) => {
  const userId = req.userId;

  const uid = new ObjectId(userId);
  try {
    const trnx = await Transaction.findOne({ creator: userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

module.exports = { getUserTransactions };

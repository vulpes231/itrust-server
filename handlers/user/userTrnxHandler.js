const Transaction = require("../../models/Transaction");

const getUserTransactions = async (req, res) => {
  const userId = req.userId;

  try {
    const trnx = await Transaction.find({ creator: userId });
    res.status(200).json({ trnx });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

module.exports = { getUserTransactions };

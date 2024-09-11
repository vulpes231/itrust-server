const Trade = require("../../models/Trade");

const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.getAllTrades();
    res.status(200).json({ trades });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const getTradesByUser = async (req, res) => {
  const userId = req.userId;
  try {
    const userTrades = await Trade.find({ creator: userId });
    res.status(200).json({ userTrades });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const getUserEarnings = async (req, res) => {
  const userId = req.userId;

  try {
    const trades = await Trade.aggregate([
      {
        $match: { creator: mongoose.Types.ObjectId(userId), status: "closed" },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalEarnings: { $sum: "$profitOrLoss" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = trades.map((trade) => trade._id);
    const data = trades.map((trade) => trade.totalEarnings);

    res.status(200).json({ labels, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  getAllTrades,
  getTradesByUser,
  getUserEarnings,
};

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

module.exports = {
  getAllTrades,
  getTradesByUser,
};

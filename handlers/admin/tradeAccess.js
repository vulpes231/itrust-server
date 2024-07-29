const Trade = require("../../models/Trade");

const createTrade = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden" });

  const { userId, botId, amountTraded, pair } = req.body;
  if (!userId || !botId || !amountTraded || !pair) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const tradeData = { amountTraded, pair };
    const newTrade = await Trade.createTrade(userId, botId, tradeData);
    res
      .status(201)
      .json({ message: "Trade created successfully", trade: newTrade });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const editTrade = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden" });

  const { id, newStatus } = req.body;
  if (!id || !newStatus)
    return res
      .status(400)
      .json({ message: "Trade ID and new status are required!" });

  try {
    const updatedTrade = await Trade.editTrade(id, newStatus);

    res.status(200).json({ message: "Trade updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const deleteTrade = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden" });

  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Trade ID is required!" });

  try {
    const deletedTrade = await Trade.deleteTrade(id);

    res.status(200).json({ message: "Trade deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const getUserTrades = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden" });

  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "User ID is required!" });

  try {
    const userTrades = await Trade.find({ creator: id });
    res.status(200).json({ userTrades });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = {
  createTrade,
  editTrade,
  deleteTrade,
  getUserTrades,
};

const Bot = require("../../models/Bot");

const addNewBot = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Forbidden access!" });

  try {
    const { name, info, img } = req.body;

    const botData = {
      name: name,
      info: info,
      img: img,
    };

    const newBot = await Bot.createBot(botData);
    res.status(201).json({ message: "Bot created successfully", bot: newBot });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "An error occurred while creating the bot.",
    });
  }
};

const updateBot = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Forbidden access!" });

  const updateData = req.body;
  const { botId } = req.body;

  try {
    const updatedBot = await Bot.editBot(botId, updateData);
    if (!updatedBot) {
      return res.status(404).json({ message: "Bot not found." });
    }
    res
      .status(200)
      .json({ message: "Bot updated successfully", bot: updatedBot });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "An error occurred while updating the bot.",
    });
  }
};

const removeBot = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Forbidden access!" });

  const { botId } = req.params;

  try {
    const deletedBot = await Bot.deleteBot(botId);
    if (!deletedBot) {
      return res.status(404).json({ message: "Bot not found." });
    }
    res.status(200).json({ message: "Bot deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "An error occurred while deleting the bot.",
    });
  }
};

module.exports = { addNewBot, updateBot, removeBot };

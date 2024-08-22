const Docu = require("../../models/Docu");

const getUserDocuments = async (req, res) => {
  const userId = req.userId;
  try {
    const userDocuments = await Docu.find({ owner: userId });

    res.status(200).json({ userDocuments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error changing password!" });
  }
};

module.exports = { getUserDocuments };

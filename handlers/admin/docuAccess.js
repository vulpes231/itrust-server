const Docu = require("../../models/Docu");
const User = require("../../models/User");

const getAllDocuments = async (req, res) => {
  try {
    const docs = await Docu.find();

    res.status(200).json({ docs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error fetching docs!" });
  }
};

const createDocument = async (req, res) => {
  const { title, subTitle, userId } = req.body;
  if (!title || !subTitle || !userId)
    return res.status(400).json({ message: "bad request!" });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found!" });

    const newDoc = {
      title: title,
      subTitle: subTitle,
      owner: user._id,
    };

    await Docu.create(newDoc);
    res.status(200).json({ message: "document created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error creating docs!" });
  }
};

module.exports = { createDocument, getAllDocuments };

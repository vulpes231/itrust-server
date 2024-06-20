const User = require("../../models/User");
const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");

const getAllUsers = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const deleteUser = async (req, res) => {
  const isAdmin = req.isAdmin;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: "Bad request" });

  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  try {
    // Find the user by userId
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Account.deleteOne({ user: userId });

    await Transaction.deleteMany({ creator: userId });

    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting user" });
  }
};

module.exports = { getAllUsers, deleteUser };

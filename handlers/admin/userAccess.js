const User = require("../../models/User");
const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");
const Bot = require("../../models/Bot");

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

const getFullUserData = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });
  const { id } = req.params;
  try {
    const userInfo = await User.findOne({ _id: id });
    if (!userInfo)
      return res.status(404).json({ message: "User info not found!" });

    const userBotInfo = await Bot.getUserBots(id);
    if (!userBotInfo)
      return res.status(404).json({ message: "User bot info not found!" });

    const userAccountInfo = await Account.findOne({ user: userInfo._id });
    if (!userAccountInfo)
      return res.status(404).json({ message: "User account info not found!" });

    const userAssets = userAccountInfo.assets.map((asset) => ({
      coinName: asset.coinName,
      address: asset.address,
      balance: asset.balance,
    }));

    const userData = {
      userId: userInfo._id,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      username: userInfo.username,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      ssn: userInfo.ssn,
      dob: userInfo.dob,
      swapBalancePaid: userInfo.swapBalancePaid,
      swapBalance: userInfo.swapBalance,
      nation: userInfo.nationality,
      currency: userInfo.currency,
      family: userInfo.family,
      occupation: userInfo.occupation,
      experience: userInfo.experience,
      emailVerified: userInfo.isContactVerified,
      isKYCVerified: userInfo.isKYCVerified,
      KYCStatus: userInfo.KYCStatus,
      work: userInfo.occupation,
      botAccess: userInfo.canUseBot,
      swapAccess: userInfo.swapBalancePaid,
      assets: userAssets,
      tradingBal: userAccountInfo.tradingBalance,
      bots: userBotInfo,
    };

    res.json(userData);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

const deleteUser = async (req, res) => {
  const isAdmin = req.isAdmin;
  const { id } = req.params;

  // console.log(id);

  if (!id) return res.status(400).json({ message: "Bad request" });

  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Account.deleteOne({ user: id });

    await Transaction.deleteMany({ creator: id });

    await User.deleteOne({ _id: id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting user" });
  }
};

const manageUserBot = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found!" });

    user.canUseBot = user.canUseBot === false ? true : false;
    await user.save();
    res.status(200).json({ message: "user bot access updated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

const manageUserSwap = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });
  const { id } = req.params;
  console.log("id");
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found!" });

    user.swapBalancePaid = user.swapBalancePaid === false ? true : false;
    await user.save();
    res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

const setSwapBalance = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  const { amount } = req.body;

  console.log(amount);
  const { id } = req.params;

  // Validate amount
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    return res.status(400).json({ message: "Invalid amount provided" });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Safely update the swapBalance
    user.swapBalance += parsedAmount;
    await user.save();

    res.status(200).json({ message: "User swap balance updated" });
  } catch (error) {
    console.error(error); // Use console.error for logging errors
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

const updateUserInfo = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

  const {
    firstname,
    lastname,
    username,
    email,
    phone,
    street,
    country,
    state,
    city,
    zipcode,
    ssn,
    dob,
    nationality,
    currency,
    experience,
    occupation,
    referral,
    family,
  } = req.body;
  const { id } = req.params;

  console.log(req.body);

  try {
    const findUser = await User.findOne({ _id: id });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let address;

    if (street) {
      address = {
        street: street || findUser.address.street,
        state: state || findUser.address.state,
        city: city || findUser.address.city,
        country: country || findUser.address.country,
        zipcode: zipcode || findUser.address.zipcode,
      };
    }

    // Update the user fields
    findUser.firstname = firstname || findUser.firstname;
    findUser.lastname = lastname || findUser.lastname;
    findUser.username = username || findUser.username;
    findUser.email = email || findUser.email;
    findUser.phone = phone || findUser.phone;
    findUser.address = address;
    findUser.ssn = ssn || findUser.ssn;
    findUser.dob = dob || findUser.dob;
    findUser.nationality = nationality || findUser.nationality;
    findUser.currency = currency || findUser.currency;
    findUser.occupation = occupation || findUser.occupation;
    findUser.experience = experience || findUser.experience;
    findUser.family = family || findUser.family;
    findUser.referral = referral || findUser.referral;

    // Save the updated user
    await findUser.save();

    // Respond with success message
    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error(error); // Log error details for debugging
    res.status(500).json({ message: "Error updating user" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getFullUserData,
  manageUserBot,
  manageUserSwap,
  setSwapBalance,
  updateUserInfo,
};

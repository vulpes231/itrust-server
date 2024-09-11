const User = require("../../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Funded = require("../../models/Funded");

const updateRemainingDay = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).populate("bots");
    if (!user) {
      throw new Error("User not found");
    }

    // Update remaining days for each bot
    user.updateRemainingDays();

    // Save the updated user
    await user.save();

    return user.bots;
  } catch (error) {
    console.error("Error fetching user bots:", error.message);
    throw error;
  }
};

const getUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error getting user" });
  }
};

const editUser = async (req, res) => {
  const userId = req.userId;

  const {
    firstname,
    lastname,
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

  try {
    // Find the user by some identifier, e.g., username
    const findUser = await User.findOne({ _id: userId });

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

const changePassword = async (req, res) => {
  const userId = req.userId;
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Create a new session
  const session = await mongoose.startSession();

  try {
    // Start a transaction
    session.startTransaction();

    // Fetch the user within the transaction
    const user = await User.findById(userId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "User not found!" });
    }

    // Check if the old password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "Invalid password entered!" });
    }

    // Hash the new password and update it
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "Error changing password!" });
  }
};

const getFunded = async (req, res) => {
  const userId = req.userId;
  const { amount, code, reason } = req.body;

  if (!amount || !reason)
    return res
      .status(400)
      .json({ message: "amount and reason fields required!" });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "user not found!" });
    }

    if (user.fundingRequested) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Already requested funding!" });
    }

    const newFundingRequest = {
      requestedBy: user._id,
      amount: amount,
      code: code,
      reason: reason,
    };

    await Funded.create(newFundingRequest);
    user.fundingRequested = true;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "funding requested" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "error requesting fund!" });
  }
};

module.exports = {
  updateRemainingDay,
  getUser,
  editUser,
  changePassword,
  getFunded,
};

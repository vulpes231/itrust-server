const User = require("../../models/User");

const bcrypt = require("bcryptjs");
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
    return res.status(400).json({ message: "all fields required!" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user not found!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "invalid password entered!" });
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);

    user.password = hashedPass;
    await user.save();
    res.status(200).json({ message: "password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error changing password!" });
  }
};

module.exports = { updateRemainingDay, getUser, editUser, changePassword };

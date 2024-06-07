const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Account = require("../../models/Account");

const signupUser = async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    password,
    email,
    phone,
    address,
    ssn,
    dob,
    occupation,
    nationality,
    currency,
    familyMember,
    experience,
  } = req.body;

  if (!username || !password || !email || !phone || !currency) {
    return res.status(400).json({ message: "Bad request!" });
  }

  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(409).json({ message: "Username taken!" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: hashPass,
      email: email,
      currency: currency,
      phone: phone,
      address: address,
      ssn: ssn,
      dob: dob,
      nationality: nationality,
      occupation: occupation,
      family: familyMember,
      experience: experience,
    });

    const savedUser = await newUser.save();

    const newAccount = new Account({
      user: savedUser._id,
    });

    await newAccount.save();

    res
      .status(201)
      .json({ message: `New user ${username} created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred. Try again later." });
  }
};

module.exports = { signupUser };

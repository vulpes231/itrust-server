const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Account = require("../../models/Account");

const signupUser = async (req, res) => {
  const { firstname, lastname, username, password, email } = req.body;

  // Check for missing required fields
  if (!username || !password || !email || !firstname || !lastname) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken." });
    }

    // Hash the password
    const hashPass = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: hashPass,
      email: email,
    });

    // Save the user
    const savedUser = await newUser.save();

    // Create a new account linked to the user
    const newAccount = new Account({
      user: savedUser._id,
    });

    await newAccount.save();

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      { user: savedUser.username, userId: savedUser._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { user: savedUser.username },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    savedUser.refreshToken = refreshToken;
    await savedUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = { signupUser };

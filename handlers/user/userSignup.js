const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Account = require("../../models/Account");
const Wallet = require("../../models/Wallet");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  const { firstname, lastname, username, password, email } = req.body;

  // Check for missing required fields
  if (!username || !password || !email || !firstname || !lastname) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Start a session for transaction
  const session = await User.startSession();
  session.startTransaction();

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: "Username already taken." });
    }

    // Hash the password
    const hashPass = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      username,
      password: hashPass,
      email,
    });

    // Save the user
    const savedUser = await newUser.save({ session });

    // Fetch master wallets
    const masterWallets = await Wallet.find().lean().session(session);

    // Create a new account linked to the user
    const newAccount = new Account({
      user: savedUser._id,
      email,
      username,
    });

    // Update account assets with master wallet addresses
    newAccount.assets = newAccount.assets.map((asset) => {
      const masterWallet = masterWallets.find(
        (wallet) => wallet.coin === asset.coinName
      );
      if (masterWallet) {
        return { ...asset, address: masterWallet.address };
      }
      return asset;
    });

    await newAccount.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    // Abort the transaction in case of error
    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error("Failed to abort transaction", abortError);
    } finally {
      session.endSession();
    }
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = { signupUser };

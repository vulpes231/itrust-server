const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const signinUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password)
    return res.status(400).json({ message: "email and password required!" });

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "user does not exist!" });

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass)
      return res.status(401).json({ message: "invalid email or password!" });

    const accessToken = jwt.sign(
      {
        user: user.username,
        userId: user._id,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        user: user.username,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    const userObj = {
      username: user.username,
      accessToken: accessToken,
    };

    res.cookie("jwt", refreshToken);
    res.status(200).json({ userObj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

module.exports = { signinUser };

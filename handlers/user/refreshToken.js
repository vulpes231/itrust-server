const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const refreshTokenHandler = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies || !cookies.jwt) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  const refreshToken = cookies.jwt;

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    const user = await User.findOne({
      username: decoded.user,
      refreshToken: refreshToken,
    });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      {
        user: user.username,
        userId: user._id,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1d" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
};

module.exports = { refreshTokenHandler };

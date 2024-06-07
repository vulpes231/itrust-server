const User = require("../../models/User");

const logoutUser = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies || !cookies.jwt) {
    return res.status(204).json({ message: "No content" }); // No content to send back
  }

  const refreshToken = cookies.jwt;

  try {
    const user = await User.findOne({ refreshToken: refreshToken });

    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.status(204).json({ message: "No content" });
    }

    // Delete the refreshToken in the database
    user.refreshToken = null;
    await user.save();

    // Clear the refresh token cookie
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    res.status(204).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { logoutUser };

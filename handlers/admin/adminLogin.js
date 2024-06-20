const bcrypt = require("bcryptjs");
const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");

const signinAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  if (!username || !password)
    return res.status(400).json({ message: "username and password required!" });

  try {
    const admin = await Admin.findOne({ username: username });
    if (!admin)
      return res.status(404).json({ message: "admin does not exist!" });

    const matchPass = await bcrypt.compare(password, admin.password);
    if (!matchPass)
      return res.status(401).json({ message: "invalid username or password!" });

    const accessToken = jwt.sign(
      {
        admin: admin.username,
        isAdmin: admin.isAdmin,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        admin: admin.username,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    admin.refreshToken = refreshToken;
    await admin.save();

    const adminObj = {
      username: user.username,
      accessToken: accessToken,
    };

    res.cookie("jwt", refreshToken);
    res.status(200).json({ adminObj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

module.exports = { signinAdmin };

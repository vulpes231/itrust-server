const bcrypt = require("bcryptjs");
const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");

const signinAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    const admin = await Admin.findOne({ username: username });
    if (!admin)
      return res.status(404).json({ message: "admin does not exist!" });

    const isAdmin = admin.isAdmin;

    if (!isAdmin) return res.status(403).json({ message: "Access forbidden" });

    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and password required!" });

    const matchPass = await bcrypt.compare(password, admin.password);
    if (!matchPass)
      return res.status(401).json({ message: "invalid username or password!" });

    const accessToken = jwt.sign(
      {
        user: admin.username,
        isAdmin: admin.isAdmin,
        adminId: admin._id,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        user: admin.username,
        isAdmin: admin.isAdmin,
        adminId: admin._id,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    admin.refreshToken = refreshToken;
    await admin.save();

    const adminObj = {
      username: admin.username,
      email: admin.email,
    };

    res.cookie("jwt", refreshToken);
    res.status(200).json({ adminObj, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const logoutAdmin = async (req, res) => {
  const isAdmin = req.isAdmin;
  const adminId = req.adminId;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access!" });

  try {
    const admin = await Admin.findOne({ _id: adminId });
    if (!admin) return res.status(404).json({ message: "admin not found!" });

    admin.refreshToken = null;
    admin.save();

    res.status(204).json({ message: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error logging out user." });
  }
};

module.exports = { signinAdmin, logoutAdmin };

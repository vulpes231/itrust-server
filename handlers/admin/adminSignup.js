const bcrypt = require("bcryptjs");
const Admin = require("../../models/Admin");

const signupAdmin = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "Bad request!" });
  }

  try {
    const existingAdmin = await Admin.findOne({ username: username });
    if (existingAdmin) {
      return res.status(409).json({ message: "Username taken!" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username: username,
      password: hashPass,
      email: email,
    });

    const savedAdmin = await newAdmin.save();

    res
      .status(201)
      .json({ message: `New admin ${username} created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred. Try again later." });
  }
};

module.exports = { signupAdmin };

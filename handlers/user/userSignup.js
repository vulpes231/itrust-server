const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const signupUser = async (req, res) => {
  const {
    firtname,
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

  if (!username || password || !email || !phone || !currency)
    return res.status(400).json({ message: " bad request!" });

  try {
    const user = await User.findOne({ username: username });
    if (user) return res.status(409).json({ message: "username taken!" });

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = {
      firstname: firtname,
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
    };

    await User.create(newUser);

    res
      .status(200)
      .json({ message: `New user ${username} created successfully.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured. Try again later" });
  }
};

module.exports = { signupUser };

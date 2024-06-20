const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
// console.log(ACCESS_TOKEN);

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "You're not logged in!" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Bad request!" });
    }

    jwt.verify(token, ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(403).json({ message: "Forbidden!" });
      }

      req.user = decoded.username;
      req.userId = decoded.userId;
      req.isAdmin = decoded.isAdmin;
      req.admin = decoded.admin;
      next();
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = { verifyJWT };

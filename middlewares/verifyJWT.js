const jwt = require("jsonwebtoken");

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

    jwt.verify(token, process.env.ACCESSTOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden!" });
      }

      req.user = decoded.username;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = { verifyJWT };

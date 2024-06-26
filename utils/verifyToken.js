const jwt = require("jsonwebtoken");
require("dotenv").config();
//constructing validation of token

const verifyToken = (req, res, next) => {
  const token = req.header("jwt_token");

  if (!token) {
    return res.status(403).json({ error: "Authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.emp = decoded.emp;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid or expired" });
  }
};

module.exports = verifyToken;

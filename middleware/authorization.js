// authMiddleware: Middleware to authenticate a user by verifying the JWT token provided in the
// 'Authorization' header of the request. It decodes the token to retrieve the user's ID and
// fetches the user details from the database. It attaches the user object to the request for
// use in subsequent middleware or route handlers. If the token is invalid or missing, it throws an error.

const jwt = require("jsonwebtoken");
require("dotenv").config(); //can access to the environment variable

//before u even fetch routes, its going to gets access to request and then if working it will just continue to next
module.exports = function (req, res, next) {
  //get token from header

  const token = req.header("jwt_token");

  //check if not token

  if (!token) {
    return res.status(403).json({ msg: "Not Authorized" });
  }

  //Verify token
  try {
    const verify = jwt.verify(token, process.env.jwtSecret);

    req.emp = verify.emp;
    req.supervisor = verify.supervisor;
    req.admin = verify.admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid", isValidToken: false });
  }
};

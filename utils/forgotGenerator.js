const jwt = require("jsonwebtoken");
require("dotenv").config();

//for generating token
function forgotGenerator(emp_email, emp_role, emp_id) {
  //call user
  const payload = {
    emp: {
      email: emp_email,
      role: emp_role,
      id: emp_id,

      // emp: "",
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "3m" });
}

module.exports = forgotGenerator;

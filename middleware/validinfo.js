//validating email

module.exports = function (req, res, next) {
  const { email, name, password, shift, location, phone } = req.body;

  function validEmail(empEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(empEmail);
  }

  if (req.path === "/register") {
    console.log(!email.length);
    if (![email, name, password, shift, location, phone].every(Boolean)) {
      return res.status(401).json("Missing Credentials"); //unauthenticated
    } else if (!validEmail(email)) {
      //check if email is invalid
      return res.status(401).json("Invalid Email");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }

  next(); //once everything is complete it will return the results
};

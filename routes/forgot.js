const router = require("express").Router();
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const forgotGenerator = require("../utils/forgotGenerator");
const resetPass = require("../utils/resetPass");
const jwt = require("jsonwebtoken");

//middleware for checking if token is valid
const authorization = require("../middleware/authorization");
const validinfo = require("../middleware/validinfo");
//defining bcrypt

const bcrypt = require("bcrypt");
const crypto = require("crypto");

//Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to check if email is formal and not vague
function isFormalEmail(email) {
  // Check if the email contains a domain and top-level domain (TLD)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.trim() === "") {
    return false; // Empty email is not valid
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return false; // Email should contain only one "@" symbol
  }

  const domainParts = parts[1].split(".");
  if (domainParts.length < 2) {
    return false; // Domain should have at least one dot
  }

  return emailRegex.test(email);
}

function encrypt(text, secretKey) {
  const iv = Buffer.from("1234567890123456"); // Use a fixed IV
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

//Reset Password
router.post("/reset", validinfo, async (req, res) => {
  try {
    const { email } = req.body;

    if (
      !isValidEmail(email) ||
      (!email.endsWith("@innovatotec.com") &&
        !email.endsWith("@gardenia.com.ph") &&
        !email.endsWith("@gmail.com"))
    ) {
      return res.status(400).json({
        error: "Invalid email domain",
      });
    }
    // Query the database to check if the user exists in any of the three tables
    const [empResult, supervisorResult, adminResult] = await Promise.all([
      pool.query("SELECT * FROM emp WHERE emp_email = $1", [email]),
      pool.query("SELECT * FROM supervisor WHERE supervisor_email = $1", [
        email,
      ]),
      pool.query("SELECT * FROM admin WHERE admin_email = $1", [email]),
    ]);

    let userData = null;
    let jwtToken = null;

    if (empResult.rows.length > 0) {
      userData = empResult.rows[0];

      const emp_email = email;
      const token = forgotGenerator(emp_email);

      const url = `${process.env.BASE_URL}reset/${emp_email}/${token}`;
      await resetPass(email, "Reset Password", url);

      return res.status(200).json({
        message: "A link to reset your password has been sent to your email.",
        email, // Include the email in the response
      });
    } else if (supervisorResult.rows.length > 0) {
      userData = supervisorResult.rows[0];

      const supervisor_email = email;
      const emp_email = supervisor_email;
      const token = forgotGenerator(emp_email);

      const url = `${process.env.BASE_URL}reset/${supervisor_email}/${token}`;
      await resetPass(email, "Reset Password", url);

      return res.status(200).json({
        message: "A link to reset your password has been sent to your email.",
        email, // Include the email in the response
      });
    } else if (adminResult.rows.length > 0) {
      userData = adminResult.rows[0];

      const admin_email = email;
      const emp_email = admin_email;
      const token = forgotGenerator(emp_email);

      const url = `${process.env.BASE_URL}reset/${admin_email}/${token}`;
      await resetPass(email, "Reset Password", url);

      return res.status(200).json({
        message: "A link to reset your password has been sent to your email.",
        email, // Include the email in the response
      });
    } else {
      return res.status(401).json({
        error: "No associated account was found, please sign up first.",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//verify reset token
router.post("/reset/:email/:token", async (req, res) => {
  const { email, token } = req.params;
  const { password } = req.body;

  if (
    !isValidEmail(email) ||
    (!email.endsWith("@innovatotec.com") &&
      !email.endsWith("@gardenia.com.ph") &&
      !email.endsWith("@gmail.com"))
  ) {
    return res.status(400).json({
      error: "Invalid email domain",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.jwtSecret);

    // Extract the email from the decoded token's payload
    const decodedEmail = decodedToken.emp ? decodedToken.emp.email : null;

    // Check if the decoded token email matches the requested email
    if (decodedEmail !== email) {
      return res.status(401).json({ error: "Invalid token" });
    }
    // Check if user exists in any of the three tables
    const [empResult, supervisorResult, adminResult] = await Promise.all([
      pool.query("SELECT * FROM emp WHERE emp_email = $1", [email]),
      pool.query("SELECT * FROM supervisor WHERE supervisor_email = $1", [
        email,
      ]),
      pool.query("SELECT * FROM admin WHERE admin_email = $1", [email]),
    ]);

    let tableName = "";
    let userEmail = null;

    const secretKey = "chie123".padEnd(32, "\0"); // Pad the key with zeroes to make it 32 bytes long

    if (empResult.rows.length > 0) {
      tableName = "emp";
      userEmail = empResult.rows[0].emp_email;

      const encryptedPassword = encrypt(password, secretKey);

      await pool.query(
        `UPDATE emp SET emp_password = $1
       WHERE emp_email = $2`,
        [encryptedPassword, email]
      );
    } else if (supervisorResult.rows.length > 0) {
      tableName = "supervisor";
      userEmail = supervisorResult.rows[0].supervisor_email;
      const encryptedPassword = encrypt(password, secretKey);
      // Perform the update operation
      await pool.query(
        `UPDATE supervisor SET supervisor_password = $1
       WHERE supervisor_email = $2`,
        [encryptedPassword, email]
      );
    } else if (adminResult.rows.length > 0) {
      tableName = "admin";
      userEmail = adminResult.rows[0].admin_email;

      const encryptedPassword = encrypt(password, secretKey);
      // Perform the update operation
      await pool.query(
        `UPDATE admin SET admin_password = $1
       WHERE admin_email = $2`,
        [encryptedPassword, email]
      );
    } else {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Expired token error
      return res.status(401).json({ error: "Token has expired" });
    } else {
      // Other errors
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});

//fetching email token
router.get("/reset/:email/:token", async (req, res) => {
  const { email, token } = req.params;

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.jwtSecret);

    // Extract the email from the decoded token's payload
    const decodedEmail = decodedToken.emp ? decodedToken.emp.email : null;

    // const decodedEmail = decodedToken.emp
    // ? decodedToken.emp.email
    // : decodedToken.supervisor
    // ? decodedToken.supervisor.email
    // : decodedToken.admin
    // ? decodedToken.admin.email
    // : null;

    // Check if the decoded token email matches the requested email
    if (decodedEmail !== email) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Check if the token has expired
    if (decodedToken.exp <= Date.now() / 1000) {
      return res.status(401).json({ error: "Token has expired" });
    }

    // Proceed with password reset logic
    // Call API to reset password using email and token
    // Display password reset form or return success message
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      // Token error or expired token error
      return res.status(401).json({ error: "Invalid token" });
    } else {
      // Other errors
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});

module.exports = router;

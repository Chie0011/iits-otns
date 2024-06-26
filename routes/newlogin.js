const router = require("express").Router();
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const forgotGenerator = require("../utils/forgotGenerator");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

//middleware for checking if token is valid
const authorization = require("../middleware/authorization");
const validinfo = require("../middleware/validinfo");
const crypto = require("crypto");

//defining bcrypt
const bcrypt = require("bcrypt");

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

//for login validation
router.post("/login", validinfo, async (req, res) => {
  try {
    const { email, password } = req.body;

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
    let role_name = "";
    let jwtToken = null;
    const secretKey = "chie123".padEnd(32, "\0"); // Pad the key with zeroes to make it 32 bytes long

    if (empResult.rows.length > 0) {
      userData = empResult.rows[0];
      role_name = userData.role_name;

      const encryptedPassword = encrypt(password, secretKey);

      // Check if incoming password matches the stored encrypted password
      if (encryptedPassword === userData.emp_password) {
        // Passwords match
      } else {
        // Passwords don't match

        return res.status(401).json({
          error: "Password is incorrect",
        });
      }
      // Check if the role name is one of the accepted values
      if (
        ![
          "$41321d54CK$$#I/GWvExCVl/JVF0T1Of0BwwdqBWn2JqVdPVjRmQVxctMYhJZ6",
        ].includes(role_name)
      ) {
        return res.status(401).json({
          error: "Invalid role name.",
        });
      }
      if (
        role_name ===
        "$41321d54CK$$#I/GWvExCVl/JVF0T1Of0BwwdqBWn2JqVdPVjRmQVxctMYhJZ6"
      ) {
        const { emp_email } = userData;

        if (!userData.emp_verified) {
          const token = forgotGenerator(emp_email);

          const url = `${process.env.BASE_URL}users/${emp_email}/verify/${token}`;
          await sendEmail(email, "Verify Email", url);

          return res.status(200).json({
            message: "An email sent to your account please verify",
          });
        }
        const emp_role = role_name;
        jwtToken = jwtGenerator(userData.emp_email, emp_role);
      }
    } else if (supervisorResult.rows.length > 0) {
      userData = supervisorResult.rows[0];
      role_name = userData.role_name;

      const encryptedPassword = encrypt(password, secretKey);

      const storedEncryptedPass = supervisorResult.rows[0].supervisor_password;

      // Check if incoming password matches the stored encrypted password
      if (
        encryptedPassword === userData.supervisor_password ||
        password === storedEncryptedPass
      ) {
        // Passwords match
      } else {
        // Passwords don't match

        return res.status(401).json({
          error: "Password is incorrect",
        });
      }

      // Check if the role name is one of the accepted values
      if (
        ![
          "4BWQd23ZqVxF1GWkVdRJrPExv/v#$C0$f1JIYCT/dWMClhHkt5XV64jd542$",
        ].includes(role_name)
      ) {
        return res.status(401).json({
          error: "Invalid role name.",
        });
      }
      if (
        role_name ===
        "4BWQd23ZqVxF1GWkVdRJrPExv/v#$C0$f1JIYCT/dWMClhHkt5XV64jd542$"
      ) {
        const { supervisor_email } = userData;

        if (!userData.supervisor_verified) {
          const emp_email = supervisor_email;
          const token = forgotGenerator(emp_email);

          const url = `${process.env.BASE_URL}users/${supervisor_email}/verify/${token}`;
          await sendEmail(email, "Verify Email", url);

          return res.status(200).json({
            message: "An email sent to your account please verify",
          });
        }
        const emp_role = role_name;
        emp_email = supervisor_email;
        jwtToken = jwtGenerator(emp_email, emp_role);
      }
    } else if (adminResult.rows.length > 0) {
      userData = adminResult.rows[0];
      role_name = userData.role_name;

      const encryptedPassword = encrypt(password, secretKey);

      const storedEncryptedPass = adminResult.rows[0].admin_password;

      // Check if incoming password matches the stored encrypted password
      if (
        encryptedPassword === userData.admin_password ||
        password === storedEncryptedPass
      ) {
        // Passwords match
      } else {
        // Passwords don't match

        return res.status(401).json({
          error: "Password is incorrect",
        });
      }

      // Check if the role name is one of the accepted values
      if (
        !["$6ZHJyMTcVjPVdQJ&42nWBqdww0FVO1FVJ/lV%^CxEvWG/IKC45d12314"].includes(
          role_name
        )
      ) {
        return res.status(401).json({
          error: "Invalid role name.",
        });
      } else if (
        role_name ===
        "$6ZHJyMTcVjPVdQJ&42nWBqdww0FVO1FVJ/lV%^CxEvWG/IKC45d12314"
      ) {
        const { admin_email } = userData;

        if (!userData.admin_verified) {
          const emp_email = admin_email;

          const token = forgotGenerator(emp_email);

          const url = `${process.env.BASE_URL}users/${admin_email}/verify/${token}`;
          await sendEmail(email, "Verify Email", url);

          return res.status(200).json({
            message: "An email sent to your account please verify",
          });
        }
        const emp_role = role_name;
        emp_email = admin_email;
        jwtToken = jwtGenerator(emp_email, emp_role);
      }
    } else {
      return res.status(401).json({
        error: "No associated account was found, please sign up first.",
      });
    }

    // Set the token and email based on the role name
    res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

const router = require("express").Router();
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

//middleware for checking if token is valid
const authorization = require("../middleware/authorization");
const validinfo = require("../middleware/validinfo");
//defining bcrypt
const crypto = require("crypto");
const bcrypt = require("bcrypt");

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

function decrypt(encryptedText, secretKey) {
  const iv = Buffer.from("1234567890123456"); // Use the same fixed IV as in encryption
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv
  );
  let decrypted = decipher.update(Buffer.from(encryptedText, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
//Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
//registering

// let name2, password2, shift2, location2, phone2;
// let token2;
let name, email, password, shift, location, phone;

router.post("/", validinfo, async (req, res) => {
  try {
    //1. Destructure the req.body (name, email, password, shift, location)

    const { name, email, password, shift, location, phone } = req.body;

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

    //2. check if user exist (if user exist then th  row error)
    //let from const emp

    let emp = await pool.query(
      "SELECT emp_name FROM emp WHERE emp_email = $1 OR emp_name = $2 OR emp_phone = $3",
      [email, name, phone]
    );

    let supervisor = await pool.query(
      "SELECT supervisor_email FROM supervisor WHERE supervisor_email = $1",
      [email]
    );

    let admin = await pool.query(
      "SELECT admin_email FROM admin WHERE admin_email = $1",
      [email]
    );

    if (
      emp.rows.length !== 0 ||
      supervisor.rows.length !== 0 ||
      admin.rows.length !== 0
    ) {
      return res.status(401).json({ error: "User already exists" });
    }

    // Hash the new password
    const secretKey = "chie123".padEnd(32, "\0"); // Pad the key with zeroes to make it 32 bytes long

    const encryptedPassword = encrypt(password, secretKey);
    //4. enter the new user inside our database

    const newEmp = await pool.query(
      "INSERT INTO emp (emp_name, emp_email, emp_password, emp_shift, emp_location, emp_phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, encryptedPassword, shift, location, phone]
    );

    //5. generating our jwt token

    const jwtToken = jwtGenerator(newEmp.rows[0].emp_email);

    let token = jwtToken;

    //6. Retrieve the user's email address

    emp = await pool.query(
      "SELECT emp_id, emp_email FROM emp WHERE emp_id = $1",
      [newEmp.rows[0].emp_id]
    );
    const { emp_email } = emp.rows[0];

    // const emp_email = emp.rows[0].emp_email;

    // Construct verification URL
    const url = `${process.env.BASE_URL}users/${newEmp.rows[0].emp_email}/verify/${token}`;

    // Send verification email
    await sendEmail(emp_email, "Verify Email", url);

    // Send response

    return res.json({ jwtToken });
    // res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:email/verify/:token", async (req, res) => {
  try {
    const { email, token } = req.params;

    const decodedToken = jwt.verify(token, process.env.jwtSecret);

    const decodedEmail = decodedToken.emp ? decodedToken.emp.email : null;

    // Check if the decoded token email matches the requested email
    if (decodedEmail !== email) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const [empResult, supervisorResult, adminResult] = await Promise.all([
      pool.query("SELECT * FROM emp WHERE emp_email = $1", [email]),
      pool.query("SELECT * FROM supervisor WHERE supervisor_email = $1", [
        email,
      ]),
      pool.query("SELECT * FROM admin WHERE admin_email = $1", [email]),
    ]);

    let tableName = "";
    let userID = null;

    if (empResult.rows.length > 0) {
      emp = await pool.query(
        "UPDATE emp SET emp_verified = true WHERE emp_email = $1",
        [email]
      );
    } else if (supervisorResult.rows.length > 0) {
      emp = await pool.query(
        "UPDATE supervisor SET supervisor_verified = true WHERE supervisor_email = $1",
        [email]
      );
    } else if (adminResult.rows.length > 0) {
      emp = await pool.query(
        "UPDATE admin SET admin_verified = true WHERE admin_email = $1",
        [email]
      );
    } else {
      return res.status(404).json({ error: "User not found" });
    }

    // Send success response
    res.status(200).json({ message: "Email verified successfully" });
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

//verifying emp through autorization
router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json({ isValidToken: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//verifying emp through autorization
router.post("/updateprofile", validinfo, async (req, res) => {
  try {
    const { id, name, email, password, shift, location, phone } = req.body;

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

    let emp = await pool.query(
      "SELECT emp_email, emp_phone, emp_name FROM emp WHERE (emp_email = $1 OR emp_name = $2 OR emp_phone = $3) AND emp_id <> $4",
      [email, name, phone, id]
    );

    let supervisor = await pool.query(
      "SELECT supervisor_email FROM supervisor WHERE supervisor_email = $1  AND supervisor_id <> $2",
      [email, id]
    );

    let admin = await pool.query(
      "SELECT admin_email FROM admin WHERE admin_email = $1 AND admin_id <> $2",
      [email, id]
    );

    if (
      emp.rows.length !== 0 ||
      supervisor.rows.length !== 0 ||
      admin.rows.length !== 0
    ) {
      return res.status(401).json({
        error:
          "The updated name, email, or phone is already in use or associated with a different account.",
      });
    }

    const secretKey = "chie123".padEnd(32, "\0"); // Pad the key with zeroes to make it 32 bytes long

    //4. enter the new user inside our database

    // Check if user exists in any of the three tables
    const [empResult, supervisorResult, adminResult] = await Promise.all([
      pool.query("SELECT * FROM emp WHERE emp_id = $1", [id]),
      pool.query("SELECT * FROM supervisor WHERE supervisor_id = $1", [id]),
      pool.query("SELECT * FROM admin WHERE admin_id = $1", [id]),
    ]);

    let tableName = "";
    let userID = null;

    if (empResult.rows.length > 0) {
      tableName = "emp";
      userID = empResult.rows[0].emp_id;

      const storedEncryptedPass = empResult.rows[0].emp_password;

      if (password !== storedEncryptedPass) {
        const encryptedPassword = encrypt(password, secretKey);
        // Password has changed, perform the update operation
        await pool.query(
          `UPDATE emp SET emp_password = $1
          WHERE emp_id = $2`,
          [encryptedPassword, id]
        );
      } else {
        // Password remains the same, no need to update
      }

      await pool.query(
        `UPDATE emp SET emp_name = $1, emp_email = $2, emp_shift = $3, emp_location = $4, emp_phone = $5 
        WHERE emp_id = $6`,
        [name, email, shift, location, phone, id]
      );
      const currentEmail = empResult.rows[0].emp_email;

      // Then, compare the current email with the new email
      if (email !== currentEmail) {
        // If the emails don't match, set supervisor_verified to false
        await pool.query(
          "UPDATE emp SET emp_verified = false WHERE emp_id = $1",
          [id]
        );
        await pool.query(
          "UPDATE ot_request SET req_email = $1 WHERE req_email = $2",
          [email, currentEmail]
        );
      }
    } else if (supervisorResult.rows.length > 0) {
      tableName = "supervisor";
      userEmail = supervisorResult.rows[0].supervisor_id;

      const storedEncryptedPass = supervisorResult.rows[0].supervisor_password;

      if (password !== storedEncryptedPass) {
        const encryptedPassword = encrypt(password, secretKey);

        // Perform the update operation
        await pool.query(
          `UPDATE supervisor SET supervisor_password = $1
         WHERE supervisor_id = $2`,
          [encryptedPassword, id]
        );
      } else {
      }

      const currentEmail = supervisorResult.rows[0].supervisor_email;

      // Then, compare the current email with the new email
      if (email !== currentEmail) {
        // If the emails don't match, set supervisor_verified to false
        await pool.query(
          "UPDATE supervisor SET supervisor_verified = false WHERE supervisor_id = $1",
          [id]
        );
      }

      await pool.query(
        `UPDATE supervisor SET supervisor_email = $1 WHERE supervisor_id = $2`,
        [email, id]
      );
    } else if (adminResult.rows.length > 0) {
      tableName = "admin";
      userEmail = adminResult.rows[0].admin_id;

      const storedEncryptedPass = adminResult.rows[0].admin_password;

      if (password !== storedEncryptedPass) {
        const encryptedPassword = encrypt(password, secretKey);

        // Perform the update operation
        await pool.query(
          `UPDATE admin SET admin_password = $1
         WHERE admin_id = $2`,
          [encryptedPassword, id]
        );
      } else {
      }

      const currentEmail = adminResult.rows[0].admin_email;

      // Then, compare the current email with the new email
      if (email !== currentEmail) {
        // If the emails don't match, set supervisor_verified to false
        await pool.query(
          "UPDATE admin SET admin_verified = false WHERE admin_id = $1",
          [id]
        );
      }

      await pool.query(
        `UPDATE admin SET admin_email = $1 WHERE admin_id = $2`,
        [email, id]
      );
    } else {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true }); // Send a success response
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" }); // Send a generic server error message
  }
});

router.post;

module.exports = router;

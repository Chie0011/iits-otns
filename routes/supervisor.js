const router = require("express").Router();
const pool = require("../db");
const sendEmail = require("../utils/sendEmail");
const rejectedEmail = require("../utils/rejectedEmail");
const approvedEmail = require("../utils/approvedEmail");

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
//middleware for checking if token is valid
const authorization = require("../middleware/authorization");
const validinfo = require("../middleware/validinfo");
//defining bcrypt

const bcrypt = require("bcrypt");

//Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to check if email is formal and not vague
function isFormalEmail(email) {
  // Check if the email contains a domain and top-level domain (TLD)
  return email.includes(".") && email.split("@")[1].includes(".");
}

//get information from database
async function sendEmail2(formData, receiverEmail, date, subject, url) {
  // Create a Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "delapenaarchie604@gmail.com",
      pass: "hqeqwueutfupftsr",
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  // Define email content
  let mailOptions = {
    from: "delapenaarchie604@gmail.com",
    to: receiverEmail,
    subject: subject,
    html: `
    
    <div style="border: 2px solid #0000FF; /* Green border */
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);">
<p style="text-align: center; font-weight: bold;">Your OT request for the following date (${date}) has been rejected by Sir Ron.</p>
<p style="text-align: center;">
<a href="${url}" style="background-color: #4CAF50; /* Green */
                     border: none;
                     color: white;
                     padding: 13px 28px;
                     border-radius: 5px;
                     text-decoration: none;
                     display: inline-block;
                     font-size: 16px;
                     margin: 4px 2px;
                     cursor: pointer;">
Go to my account
</a>
</p>
</div>

  `, // Include the URL in the email content
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

router.get("/", authorization, async (req, res) => {
  try {
    //req.supervisor has the payload
    // Extract the UUID value from req.supervisor.id

    // Query the supervisor database to check if supervisor_verified is false
    const supervisor = await pool.query(
      "SELECT * FROM supervisor WHERE supervisor_email = $1",
      [req.emp.email]
    );

    if (supervisor.rows.length === 0) {
      // If no supervisor found with the provided email
      return res.status(404).json({ error: "Supervisor not found" });
    }

    // Check if supervisor_verified is false
    if (!supervisor.rows[0].supervisor_verified) {
      // If supervisor_verified is false, send response to set setAuth to false
      return res.status(404).json({ error: "Email not verified" });
    }

    // If supervisor_verified is true, send the supervisor data
    res.json(supervisor.rows[0]);
  } catch (err) {
    console.error(err.message);
    console.error("Error querying database:", err);

    res.status(500).send("Server Error");
  }
});

//Get all todos

router.get("/request", async (req, res) => {
  try {
    const allRequest = await pool.query("SELECT * FROM ot_request");
    res.json(allRequest.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/allrejected", async (req, res) => {
  try {
    const allRequest = await pool.query(
      "SELECT * FROM ot_request WHERE req_status LIKE '%Rejected%'"
    );
    res.json(allRequest.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/allapproved", async (req, res) => {
  try {
    const allRequest = await pool.query(
      "SELECT * FROM ot_request WHERE req_status LIKE '%Approved%'"
    );
    res.json(allRequest.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Update an Info
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    // Validate that the 'date' value is provided
    // if (!date) {
    //   return res.status(400).json({
    //     error: "Date is required",
    //   });
    // }

    const updateForm = await pool.query(
      "UPDATE ot_request SET req_remarks = $1 WHERE req_id = $2",
      [remarks, id]
    );

    res.status(200).json({ message: "Remarks was updated" });
  } catch (err) {
    console.error(err.message);
  }
});

//APPROVE A REQUEST

// Express route to handle request approve
// Express route to handle request approve
router.put("/request/:id/:email/:date", async (req, res) => {
  try {
    const { id, email, date } = req.params; // Extract request ID from URL params
    const { status, setMail } = req.body; // Extract status and email from request body
    const supervisorName = setMail; // Replace with actual supervisor's name
    const admin1Name = setMail; // Replace with actual supervisor's name
    const admin2Name = setMail; // Replace with actual supervisor's name

    // Function to format the date to YYYY-MM-DD
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(date);

    if (setMail) {
      const admin = await pool.query(
        "SELECT * FROM admin WHERE admin_email = $1",
        [setMail]
      );

      if (admin.rows.length > 0) {
        const { role_key } = admin.rows[0];
        console.log("Role key:", role_key); // Log the role key

        if (role_key === "DIANE") {
          console.log("Admin is DIANE");
          const updateResult = await pool.query(
            "UPDATE ot_request SET req_status = $1 WHERE req_id = $2",
            [`${status} by ${admin1Name}`, id]
          );

          // Check if the request was successfully updated
          if (updateResult.rowCount === 1) {
            await approvedEmail(
              req.body,
              email,
              formattedDate,
              setMail,
              "OT Approved Request",
              "https://iits-otns.vercel.app"
            );

            // Wait for the email sending operation to complete before responding
            return res.status(200).json({
              message: `Request ${status.toLowerCase()} by ${admin1Name}`,
            });
          }
        } else if (role_key === "PHD") {
          console.log("Admin is PHD");
          const updateResult = await pool.query(
            "UPDATE ot_request SET req_status = $1 WHERE req_id = $2",
            [`${status} by ${admin2Name}`, id]
          );

          // Check if the request was successfully updated
          if (updateResult.rowCount === 1) {
            await approvedEmail(
              req.body,
              email,
              formattedDate,
              setMail,
              "OT Approved Request",
              "https://iits-otns.vercel.app"
            );

            // Wait for the email sending operation to complete before responding
            return res.status(200).json({
              message: `Request ${status.toLowerCase()} by ${admin2Name}`,
            });
          }
        }
      }
    }

    console.log("Admin is neither DIANE nor PHD");
    // Update the request status in the database with supervisor's name
    const updateResult = await pool.query(
      "UPDATE ot_request SET req_status = $1 WHERE req_id = $2",
      [`${status} by ${supervisorName}`, id]
    );

    // Check if the request was successfully updated
    if (updateResult.rowCount === 1) {
      await approvedEmail(
        req.body,
        email,
        formattedDate,
        setMail,
        "OT Approved Request",
        "https://iits-otns.vercel.app"
      );

      // Wait for the email sending operation to complete before responding
      return res.status(200).json({
        message: `Request ${status.toLowerCase()} by ${supervisorName}`,
      });
    }

    // If the email is not provided or no admin with the given email is found, handle it here
    console.log("Admin not found or invalid email provided");
    res
      .status(404)
      .json({ error: "Admin not found or invalid email provided" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ error: "Failed to reject request" });
  }
});

// Express route to handle request reject
router.put("/reject/:id/:email/:date", async (req, res) => {
  try {
    const { id, email, date } = req.params; // Extract request ID, email, and date from URL params
    const { setMail, status } = req.body; // Extract status from request body

    const supervisorName = setMail; // Replace with actual supervisor's name
    const admin1Name = setMail; // Replace with actual supervisor's name
    const admin2Name = setMail; // Replace with actual supervisor's name

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(date);

    if (setMail) {
      const admin = await pool.query(
        "SELECT * FROM admin WHERE admin_email = $1",
        [setMail]
      );

      if (admin.rows.length > 0) {
        const { role_key } = admin.rows[0];
        console.log("Role key:", role_key); // Log the role key

        if (role_key === "DIANE") {
          console.log("Admin is DIANE");
          const updateResult = await pool.query(
            "UPDATE ot_request SET req_status = $1 WHERE req_id = $2",
            [`${status} by ${admin1Name}`, id]
          );

          // Check if the request was successfully updated
          if (updateResult.rowCount === 1) {
            await rejectedEmail(
              req.body,
              email,
              formattedDate,
              setMail,
              "OT Rejected Request",
              "https://iits-otns.vercel.app"
            );

            // Wait for the email sending operation to complete before responding
            return res.status(200).json({
              message: `Request ${status.toLowerCase()} by ${admin1Name}`,
            });
          }
        } else if (role_key === "PHD") {
          console.log("Admin is PHD");
          const updateResult = await pool.query(
            "UPDATE ot_request SET req_status = $1 WHERE req_id = $2",
            [`${status} by ${admin2Name}`, id]
          );

          // Check if the request was successfully updated
          if (updateResult.rowCount === 1) {
            await rejectedEmail(
              req.body,
              email,
              formattedDate,
              setMail,
              "OT Rejected Request",
              "https://iits-otns.vercel.app"
            );

            // Wait for the email sending operation to complete before responding
            return res.status(200).json({
              message: `Request ${status.toLowerCase()} by ${admin2Name}`,
            });
          }
        }
      }
    }

    console.log("Admin is neither DIANE nor PHD");
    // Update the request status in the database with supervisor's name
    const updateResult = await pool.query(
      "UPDATE ot_request SET req_status = $1 WHERE req_id = $2",
      [`${status} by ${supervisorName}`, id]
    );

    // Check if the request was successfully updated
    if (updateResult.rowCount === 1) {
      await rejectedEmail(
        req.body,
        email,
        formattedDate,
        setMail,
        "OT Rejected Request",
        "https://iits-otns.vercel.app"
      );

      // Wait for the email sending operation to complete before responding
      return res.status(200).json({
        message: `Request ${status.toLowerCase()} by ${supervisorName}`,
      });
    }

    // If the email is not provided or no admin with the given email is found, handle it here
    console.log("Admin not found or invalid email provided");
    res
      .status(404)
      .json({ error: "Admin not found or invalid email provided" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ error: "Failed to reject request" });
  }
});

//COUNT ALL APPROVE REJECTED
router.get("/count", authorization, async (req, res) => {
  try {
    // Fetch all OT requests from the database
    const ot_request = await pool.query("SELECT * FROM ot_request");

    // Calculate counts for each status
    const totalCount = ot_request.rows.length;
    const pendingCount = ot_request.rows.filter((request) =>
      request.req_status.includes("Pending")
    ).length;
    const approvedCount = ot_request.rows.filter((request) =>
      request.req_status.includes("Approved")
    ).length;
    const rejectedCount = ot_request.rows.filter((request) =>
      request.req_status.includes("Rejected")
    ).length;

    res.json({
      ot_request: ot_request.rows,
      totalCount,
      pendingCount,
      approvedCount,
      rejectedCount,
    });
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).send("Server Error");
  }
});

router.get("/totalpending", async (req, res) => {
  try {
    const allPending = await pool.query(
      "SELECT * FROM ot_request WHERE req_status LIKE '%Pending%'"
    );
    res.json(allPending.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

const router = require("express").Router();
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const nodemailer = require("nodemailer");
//middleware for authenticating the user for accessing dashboard
const authorization = require("../middleware/authorization");
const informEmail = require("../utils/informEmail");
//get information from database

router.get("/", authorization, async (req, res) => {
  try {
    // Fetch all OT requests from the database
    const ot_request = await pool.query(
      "SELECT * FROM ot_request WHERE req_email = $1 AND req_status LIKE '%Pending%'",
      [req.emp.email]
    );

    res.json(ot_request.rows); // Return all OT requests
  } catch (err) {
    console.error("Error querying database:", err); // Fixed typo here
    res.status(500).send("Server Error");
  }
});

//get all approved per user
router.get("/approve", authorization, async (req, res) => {
  try {
    // Fetch OT requests with status containing "Approved" from the database
    const ot_request = await pool.query(
      "SELECT * FROM ot_request WHERE req_email = $1 AND req_status LIKE '%Approved%'",
      [req.emp.email]
    );

    res.json(ot_request.rows); // Return OT requests with status containing "Approved"
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).send("Server Error");
  }
});

//get all rejected per user
router.get("/reject", authorization, async (req, res) => {
  try {
    // Fetch OT requests with status containing "Approved" from the database
    const ot_request = await pool.query(
      "SELECT * FROM ot_request WHERE req_email = $1 AND req_status LIKE '%Rejected%'",
      [req.emp.email]
    );

    res.json(ot_request.rows); // Return OT requests with status containing "Approved"
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).send("Server Error");
  }
});

//get all count per user
router.get("/count", authorization, async (req, res) => {
  try {
    // Fetch all OT requests from the database
    const ot_request = await pool.query(
      "SELECT * FROM ot_request WHERE req_email = $1",
      [req.emp.email]
    );

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

//posting a form within the database ot_request
router.post("/insert", async (req, res) => {
  try {
    // If the middleware allows access, proceed with inserting the data
    const {
      name,
      email,
      shift,
      location,
      date,
      timeto,
      timefrom,
      duration,
      by,
      department,
      reason,
      timestamp,
    } = req.body;

    const newRequest = await pool.query(
      "INSERT INTO ot_request (req_name, req_email, req_shift, req_location, req_date, req_timeto, req_timefrom, req_duration, req_by, req_department, req_reason, req_timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [
        name,
        email,
        shift,
        location,
        date,
        timeto,
        timefrom,
        duration,
        by,
        department,
        reason,
        timestamp,
      ]
    );
    // Query the supervisor database to check if supervisor_verified is false
    // Query the supervisor database to get the supervisor data
    const supervisor = await pool.query("SELECT * FROM supervisor");

    const { supervisor_email } = supervisor.rows[0];
    // Emails from paranaque
    const blockedEmails = [
      "cruzdel012456@gmail.com",
      "anjie.boton@innovatotec.com",
    ];

    // Send email with form data if email is not in the emails list
    if (!blockedEmails.includes(email)) {
      await informEmail(
        req.body,
        supervisor_email,
        "OT Request Form",
        "https://iits-otns.vercel.app"
      );
    }
    const jwtToken = jwtGenerator(newRequest.rows[0].emp_email);

    res.status(200).json({ jwtToken });
  } catch (err) {
    // If an error occurs, check the status code and respond accordingly
    if (err.status === 403) {
      res.status(403).json({ error: "Unauthorized access" });
    } else if (err.status === 401) {
      res.status(401).json({ error: "Token is not valid" });
    } else {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
});

////Delete an Info
router.delete("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteInfo = await pool.query("DELETE FROM emp WHERE emp_id = $1", [
      id,
    ]);

    // Deletion logic
    res.status(200).json({ message: "Form was deleted" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the form" });
  }
});

//Update an Info
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, timeto, timefrom, duration, by, department, reason } =
      req.body;

    // Validate that the 'date' value is provided
    // if (!date) {
    //   return res.status(400).json({
    //     error: "Date is required",
    //   });
    // }

    const updateForm = await pool.query(
      "UPDATE ot_request SET req_date = $1, req_timeto = $2, req_timefrom = $3, req_duration = $4, req_by = $5, req_department = $6, req_reason = $7 WHERE req_id = $8",
      [date, timeto, timefrom, duration, by, department, reason, id]
    );

    res.status(200).json({ message: "Form was deleted" });
  } catch (err) {
    console.error(err.message);
  }
});

//fetch current OTR number (This is for shpreadsheet online)
router.get("/otr", async (req, res) => {
  try {
    const otrequest = await pool.query("SELECT MAX(req_id) FROM ot_request");

    if (otrequest.rows.length === 0 || otrequest.rows[0].max === null) {
      // Handle the case where ot_request table is empty
      throw new Error("OTR number not available");
    }

    const max_req_id = otrequest.rows[0].max;

    const currentOTRNumber = "OTR-" + max_req_id.toString().padStart(5, "0");
    res.json({ currentOTRNumber }); // Send the fetched OTR number as JSON response
  } catch (error) {
    console.error("Error fetching current OTR number:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Get Current Number

module.exports = router;

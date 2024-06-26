const router = require("express").Router();
const pool = require("../db");
const { format } = require("date-fns");

//middleware for checking if token is valid
const authorization = require("../middleware/authorization");

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

//fetching admin info
router.get("/", authorization, async (req, res) => {
  try {
    //req.supervisor has the payload
    // Extract the UUID value from req.supervisor.id

    // Query the supervisor database to check if supervisor_verified is false
    const admin = await pool.query(
      "SELECT * FROM admin WHERE admin_email = $1",
      [req.emp.email]
    );

    if (admin.rows.length === 0) {
      // If no supervisor found with the provided email
      return res.status(404).json({ error: "Admin not found" });
    }

    // Check if supervisor_verified is false
    if (!admin.rows[0].admin_verified) {
      // If supervisor_verified is false, send response to set setAuth to false
      return res.status(404).json({ error: "Email not verified" });
    }

    // If supervisor_verified is true, send the supervisor data
    res.json(admin.rows[0]);
  } catch (err) {
    console.error(err.message);
    console.error("Error querying database:", err);

    res.status(500).send("Server Error");
  }
});

//Get all recent request

router.get("/request", async (req, res) => {
  try {
    // Query to fetch the 5 most recent requests ordered by date
    const recentRequests = await pool.query(
      "SELECT * FROM ot_request ORDER BY req_date DESC LIMIT 5"
    );
    res.json(recentRequests.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//RECENT PENDING REQUEST

router.get("/recent", async (req, res) => {
  try {
    // Fetch pending OT requests from the database
    const query = `
    SELECT * 
    FROM ot_request 
    WHERE req_status = 'Pending' 
    ORDER BY req_date DESC 
    LIMIT 5;
      `;
    const { rows } = await pool.query(query);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching pending OT requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//BAR CHART DATA

router.get("/date", async (req, res) => {
  try {
    // Fetch OT request data from the database
    const result = await pool.query(`
    SELECT TO_CHAR(req_date, 'YYYY-MM') AS month_year, COUNT(*) AS total_requests
    FROM ot_request
    GROUP BY TO_CHAR(req_date, 'YYYY-MM')
    ORDER BY TO_CHAR(req_date, 'YYYY-MM')
  `);

    // Extract the data from the database result
    const data = result.rows.map((row) => ({
      month_year: row.month_year, // Extract the month and year in the format 'YYYY-MM'
      total_requests: parseInt(row.total_requests), // Ensure total_requests is converted to a number
    }));

    // Send the data as JSON response
    res.json(data);
  } catch (error) {
    console.error("Error fetching OT request data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all OT requests from the database including location information
router.get("/location", authorization, async (req, res) => {
  try {
    const ot_requests = await pool.query(
      "SELECT req_location, req_status FROM ot_request"
    );

    // Initialize an object to store counts per location
    const countsPerLocation = {};

    // Calculate counts for each status per location
    ot_requests.rows.forEach((request) => {
      const location = request.req_location;
      const status = request.req_status;

      if (!countsPerLocation[location]) {
        countsPerLocation[location] = {
          totalCount: 0,
          pendingCount: 0,
          approvedCount: 0,
          rejectedCount: 0,
        };
      }

      countsPerLocation[location].totalCount++;
      if (status.includes("Pending"))
        countsPerLocation[location].pendingCount++;
      if (status.includes("Approved"))
        countsPerLocation[location].approvedCount++;
      if (status.includes("Rejected"))
        countsPerLocation[location].rejectedCount++;
    });

    res.json({ countsPerLocation });
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).send("Server Error");
  }
});

//get all users
router.get("/users", async (req, res) => {
  try {
    // Fetch all users from the emp table
    const usersResult = await pool.query("SELECT * FROM emp");

    // Iterate over each user
    // Iterate over each user
    const usersData = await Promise.all(
      usersResult.rows.map(async (user) => {
        // Fetch total requests per month for the user from the ot_request table
        const requestsResult = await pool.query(
          `
              SELECT TO_CHAR(req_date, 'YYYY-MM') AS month_year, COUNT(*) AS total_requests
              FROM ot_request
              WHERE req_email = $1
              GROUP BY TO_CHAR(req_date, 'YYYY-MM')
              ORDER BY TO_CHAR(req_date, 'YYYY-MM')
              `,
          [user.emp_email]
        );

        // Extract month-wise request counts for the user
        const requestsPerMonth = requestsResult.rows.map((row) => ({
          month_year: row.month_year,
          total_requests: parseInt(row.total_requests),
        }));

        console.log("SQL Query:", requestsPerMonth); // Log the SQL query
        console.log("SQL Parameters:", [user.emp_email]); // Log the SQL parametersameters
        return {
          ...user,
          requests_per_month: requestsPerMonth,
        };
      })
    );

    // Send the user details with total requests per month as JSON response
    res.json(usersData);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update an Email
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    if (!id) {
      return res.status(400).json({
        error: "id is required",
      });
    }

    const updateEmail = await pool.query(
      "UPDATE emp SET emp_email = $1 WHERE emp_id = $2",
      [email, id]
    );

    res.status(200).json({ message: "Email was updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//update shift
router.put("/shift/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { shift_name, shift_times } = req.body;

    if ((!shift_name, !shift_times)) {
      return res.status(400).json({
        error: "Shift and Time is required",
      });
    }

    if (!id) {
      return res.status(400).json({
        error: "id is required",
      });
    }

    const updateShift = await pool.query(
      "UPDATE shifts SET shift_name = $1, shift_times = $2 WHERE shift_id = $3",
      [shift_name, shift_times, id]
    );

    res.status(200).json({ message: "Email was updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//fetch locations
router.get("/loc", async (req, res) => {
  try {
    const location = await pool.query("SELECT * FROM location");
    res.json(location.rows);
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).send("Server Error");
  }
});

//fetch shifts

router.get("/shifts", async (req, res) => {
  try {
    const shifts = await pool.query("SELECT * FROM shifts");
    res.json(shifts.rows);
  } catch (err) {
    console.error("Error fetching shifts:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

//insert a new location
router.post("/insert", async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({
        error: "Location is required",
      });
    }

    const newLocation = await pool.query(
      "INSERT INTO location (loc_name) VALUES ($1)",
      [location]
    );

    res.status(200).json({ message: "New location was added" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//insert new shift and time
router.post("/shifts", async (req, res) => {
  try {
    const { shift_name, shift_times } = req.body;
    // Assuming you have a 'shifts' table with columns 'shift_id', 'shift_name', and 'shift_times'
    const newShift = await pool.query(
      "INSERT INTO shifts (shift_name, shift_times) VALUES ($1, $2) RETURNING *",
      [shift_name, shift_times]
    );
    res.status(200).json({ message: "New Shift was added" });
  } catch (error) {
    console.error("Error adding shift:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

////Delete a location
router.delete("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteLocation = await pool.query(
      "DELETE FROM location WHERE loc_id = $1",
      [id]
    );

    // Deletion logic
    res.status(200).json({ message: "Form was deleted" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the form" });
  }
});

//Delete a Shift
router.delete("/shift/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteLocation = await pool.query(
      "DELETE FROM shifts WHERE shift_id = $1",
      [id]
    );

    // Deletion logic
    res.status(200).json({ message: "Form was deleted" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the form" });
  }
});
module.exports = router;

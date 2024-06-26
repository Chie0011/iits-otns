const router = require("express").Router();
const pool = require("../db");

//middleware for authenticating the user for accessing dashboard
const authorization = require("../middleware/authorization");

//get information from database with authorization to check for jwt token validity

router.get("/", authorization, async (req, res) => {
  try {
    //req.emp has the payoad
    // Extract the UUID value from req.emp.id

    // //querying or passing only user name
    const ot_request = await pool.query(
      "SELECT * FROM emp WHERE emp_email = $1",
      [req.emp.email]
    );

    const emp = await pool.query("SELECT * FROM emp WHERE emp_email = $1", [
      req.emp.email,
    ]);

    if (emp.rows.length === 0) {
      // If no supervisor found with the provided email
      return res.status(404).json({ error: "AppTech not found" });
    }

    // Check if supervisor_verified is false
    if (!emp.rows[0].emp_verified) {
      // If supervisor_verified is false, send response to set setAuth to false
      return res.status(404).json({ error: "Email not verified" });
    }

    res.json(ot_request.rows[0]);
  } catch (err) {
    console.error(err.message);
    console.error("Error querying database:", err);

    res.status(500).send("Server Error");
  }
});
module.exports = router;

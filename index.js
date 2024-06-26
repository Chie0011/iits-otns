const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// const pool = require("./db");
const axios = require("axios"); // Import Axios
const PORT = process.env.PORT || 5000;
require("dotenv").config();

//middleware
app.use(
  cors({
    origin: "https://iits-otns.vercel.app",
    methods: "GET,POST,OPTIONS,PUT,PATCH,DELETE",
    allowedHeaders: "X-Requested-With,content-type, jwt_token",
    credentials: true,
  })
);
app.use(express.json()); //req.body

const userRoutes = require("./routes/jwtAuth");
const userRoutes2 = require("./routes/supervisor");
const userRoutes3 = require("./routes/admin");
const userRoutes4 = require("./routes/newlogin");
const userRoute5 = require("./routes/forgot");

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

app.options("*", cors());

//ROUTES//

// Proxy route to forward requests to the Google Apps Script URL
app.post("/api/google-apps-script-proxy", async (req, res) => {
  try {
    const response = await axios.post(
      "https://script.google.com/macros/s/AKfycbwqUvxyJh--CEo0fyNylvlUzaRQ13hXMXbgCXMtB-1qm720EpF3_HJzwQpt4rb8hXF0Gw/exec",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    // Log the error details
    console.error("Error:", error);

    // Check for specific error conditions and handle them accordingly
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "Server responded with error status:",
        error.response.status
      );
      console.error("Error details:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server.");
      res.status(500).json({ error: "No response received from server" });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
      res.status(500).json({ error: "Error setting up request" });
    }
  }
});

//Register and Login routes

app.use("/api/auth/users", userRoutes);
app.use("/api/auth/emp", userRoutes4);
//Dashboard routes
app.use("/api/auth/forgot", userRoute5);
app.use("/api/auth/supervisor", userRoutes2);
//admin routes
app.use("/api/auth/admin", userRoutes3);
//apptech routes
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/request", require("./routes/request"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
//process.env.PORT ||

app.listen(PORT, () => console.log("Server is running on port 5000"));

// app.listen(5000, () => {
//   console.log("server has started on port 5000");
// });

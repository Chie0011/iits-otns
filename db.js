//CONNECTING DATABASE TO THE SERVER
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

pool.connect((err) => {
  if (err) throw err;
  console.log("Connect to PostgreSQL successfully!");
});

module.exports = pool;

//uncommented current db
// const Pool = require("pg").Pool;

// require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// });

// pool.connect((err) => {
//   if (err) {
//     console.error("Error connecting to PostgreSQL:", err);
//   } else {
//     console.log("Connected to PostgreSQL successfully!");
//   }
// });

// module.exports = pool;

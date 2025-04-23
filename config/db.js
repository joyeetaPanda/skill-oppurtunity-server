const mysql = require("mysql2");
require("dotenv").config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
// });
const db=mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection error:", err.message);
  } else {
    console.log("✅ MySQL connection pool established.");
    connection.release(); // always release back to pool
  }
});


// db.connect((err) => {
//   if (err) {throw err, console.error("MySQL connection error: ", err);};
//   console.log("MySQL connected!");
// });

module.exports = db;

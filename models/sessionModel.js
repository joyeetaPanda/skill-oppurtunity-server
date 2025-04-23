const db = require("../config/db");
const crypto = require("crypto");

function generateHatString(length = 10) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "") // remove non-alphanumerics
    .slice(0, length);
}

// exports.findUserByEmail = (email, callback) => {
//   db.query("SELECT * FROM users WHERE email = ?", [email], callback);
// };

// exports.saveOTP = (email, otp, callback) => {
//   db.query(
//     "UPDATE users SET otp = ?, otp_expiry = NOW() + INTERVAL 10 MINUTE WHERE email = ?",
//     [otp, email],
//     callback
//   );
// };

// exports.verifyOTP = (email, otp, callback) => {
//   db.query(
//     "SELECT * FROM users WHERE email = ? AND otp = ? AND otp_expiry > NOW()",
//     [email, otp],
//     callback
//   );
// };

// const db = require('../config/db'); // Not needed for mock

// Mock user data
exports.getSessionById = (SESSION_ID, callback) => {
  db.query(
    `SELECT 
  sessions.*, 
  user_master.*
FROM 
  sessions
JOIN 
  user_master 
ON 
  user_master.ID = sessions.USER_ID
WHERE 
  sessions.SESSION_ID = ?;
`,
    [SESSION_ID],
    callback
  );
};
exports.createSession = (data, callback) => {
  let insertData = {
    USER_ID: data.ID,
    SESSION_ID: generateHatString(20),
  };

  const columns = Object.keys(insertData).join(", ");
  const placeholders = Object.keys(insertData)
    .map(() => "?")
    .join(", ");
  const values = Object.values(insertData);

  const sql = `INSERT INTO sessions (${columns}) VALUES (${placeholders})`;

  db.query(sql, values, (err, result) => {
    if (err) return callback(err);

    // Attach insert ID if needed (if you have an auto-increment ID column)
    const responseData = {
      ...insertData,
    };

    callback(null, responseData);
  });
};

exports.updateSession = (data, callback) => {
  const { SESSION_ID, ...updateData } = data;

  if (!SESSION_ID) {
    return callback(new Error("SESSION_ID is required to update the session"));
  }

  const setClause = Object.keys(updateData)
    .map((col) => `${col} = ?`)
    .join(", ");
  const values = Object.values(updateData);

  const sql = `UPDATE sessions SET ${setClause} WHERE SESSION_ID = ?`;

  db.query(sql, [...values, SESSION_ID], (err, result) => {
    if (err) return callback(err);

    const updatedSession = {
      ...updateData,
      SESSION_ID,
    };

    callback(null, updatedSession);
  });
};

exports.createTable_sessions = (callback) => {
  db.query(
    `CREATE TABLE sessions (
  
  USER_ID VARCHAR(20),
  SESSION_ID VARCHAR(20),
  IS_LOGGED_OUT BOOLEAN DEFAULT FALSE

);
`,

    callback
  );
};

const db = require("../config/db");

exports.findUserByEmail = (email, callback) => {
  db.query(
    "SELECT * FROM user_master WHERE EMAIL = ? AND IS_DELETED = ? AND IS_ACTIVE = ?",
    [email, false, true],
    callback
  );
};
exports.createUser = (data, callback) => {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");
  const values = Object.values(data);

  const sql = `INSERT INTO user_master (${columns}) VALUES (${placeholders})`;

  db.query(sql, values, (err, result) => {
    if (err) return callback(err);

    const insertedUser = {
      ...data,
      ID: result.insertId, // assuming ID is auto-increment primary key
    };

    callback(null, insertedUser);
  });
};
exports.updateUser = (data, callback) => {
  const { ID, ...updateData } = data;
  if (data.NEW_USER != 10) {
    updateData.NEW_USER = false;
  } else {
    delete updateData.NEW_USER;
  }
  if (!ID) {
    return callback(new Error("ID is required to update user"));
  }

  const columns = Object.keys(updateData);
  const setClause = columns.map((col) => `${col} = ?`).join(", ");
  const values = Object.values(updateData);

  const sql = `UPDATE user_master SET ${setClause} WHERE ID = ?`;

  db.query(sql, [...values, ID], (err, result) => {
    if (err) return callback(err);

    const updatedUser = {
      ...updateData,
      ID,
    };

    callback(null, updatedUser);
  });
};

// exports.saveOTP = (email, otp, callback) => {
//   db.query(
//     "UPDATE users SET otp = ?, otp_expiry = NOW() + INTERVAL 10 MINUTE WHERE email = ?",
//     [otp, email],
//     callback
//   );
// };

exports.verifyOTP = (EMAIL, OTP, callback) => {
  db.query(
    "SELECT * FROM user_master WHERE EMAIL = ? AND OTP = ? AND IS_DELETED = ? AND IS_ACTIVE = ? ",
    [EMAIL, OTP, false, true],
    callback
  );
};

exports.getAllUsers = (callback) => {
  db.query(
    "SELECT * FROM user_master WHERE IS_DELETED = FALSE AND IS_ACTIVE = TRUE",
    callback
  );
};

// const db = require('../config/db'); // Not needed for mock

// Mock user data
// const mockUser = {
//   id: 1,
//   email: "joyeeta41@gmail.com",
//   otp: 568524,
//   otp_expiry: null,
// };

// exports.saveOTP = (email, otp, callback) => {
//   if (email === mockUser.email) {
//     mockUser.otp = otp;
//     mockUser.otp_expiry = new Date(Date.now() + 10 * 60000); // 10 minutes expiry
//     callback(null, { affectedRows: 1 });
//   } else {
//     callback(null, { affectedRows: 0 });
//   }
// };

// exports.verifyOTP = (email, otp, callback) => {
//   const now = new Date();
//   if (
//     email === mockUser.email &&
//     otp === mockUser.otp
//     // &&
//     // mockUser.otp_expiry &&
//     // now < mockUser.otp_expiry
//   ) {
//     callback(null, [mockUser]);
//   } else {
//     callback(null, []);
//   }
// };

exports.createTable_user_master = (callback) => {
  db.query(
    `CREATE TABLE user_master (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      NAME VARCHAR(255),
      EMAIL VARCHAR(255) UNIQUE,
      MOBILE VARCHAR(20),
      PROFILE_IMAGE TEXT,
      CURRENT_LOCATION VARCHAR(255),
      OPEN_TO_SPEAK_AT VARCHAR(255),
      EXPERIENCE_DETAILS TEXT,
      EXPERTISE_DETAILS TEXT,
      SPECIALIZATION TEXT,
      SPEAKER_PREFERENCE VARCHAR(255),
      OTP VARCHAR(255),
      ROLES TEXT, -- Storing comma-separated roles like 'admin,user',0-admin,1-speaker
      IS_VERIFIED BOOLEAN DEFAULT FALSE,
      IS_ACTIVE BOOLEAN DEFAULT TRUE,
      IS_DELETED BOOLEAN DEFAULT FALSE,
      NEW_USER BOOLEAN DEFAULT TRUE,
      CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`,
    callback
  );
};

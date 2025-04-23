const db = require("../config/db");

exports.getEnrolledUserById = (USER_ID, callback) => {
  db.query(
    `SELECT DISTINCT 
  eu.EVENT_ID,
  um.NAME AS USER_NAME, 
  ue.*
FROM enrolled_users eu
JOIN user_master um ON eu.USER_ID = um.ID
JOIN university_events ue ON eu.EVENT_ID = ue.ID
WHERE eu.USER_ID = ? AND eu.CANCELLED = FALSE

`,
    [USER_ID],
    callback
  );
};

exports.createEnrolledUser = (data, callback) => {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");
  const values = Object.values(data);

  const sql = `INSERT INTO enrolled_users (${columns}) VALUES (${placeholders})`;

  db.query(sql, values, (err, result) => {
    if (err) return callback(err);

    const insertedUser = {
      ...data,
      ID: result.insertId, // assuming ID is auto-increment primary key
    };

    callback(null, insertedUser);
  });
};
exports.updateEnrolledUser = (data, callback) => {
  const { ID, ...updateData } = data;
  if (!ID) {
    return callback(new Error("ID is required to update user"));
  }

  const columns = Object.keys(updateData);
  const setClause = columns.map((col) => `${col} = ?`).join(", ");
  const values = Object.values(updateData);

  const sql = `UPDATE enrolled_users SET ${setClause} WHERE ID = ?`;

  db.query(sql, [...values, ID], (err, result) => {
    if (err) return callback(err);

    const updatedUser = {
      ...updateData,
      ID,
    };

    callback(null, updatedUser);
  });
};

exports.createTable_enrolled_users = (callback) => {
  db.query(
    `CREATE TABLE enrolled_users (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      USER_ID INT,
      EVENT_ID INT,
      CANCELLED BOOLEAN DEFAULT FALSE,
      CREATED_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    callback
  );
};

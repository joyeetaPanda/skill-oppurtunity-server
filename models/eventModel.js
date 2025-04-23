const db = require("../config/db");

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
const mockEvent = [
  {
    UNIVERSITY_NAME: "Harvard University",
    LOCATION: "Harvard University",
    TOPIC: "Data Science",
    PAYMENT_MODE: "Paid",
    START_TIME: "4 PM",
    END_TIME: "5 PM",
    DATE: "21 April, 2025",
  },
];

exports.getAllEvents = (data, callback) => {
  let { START_DATE, END_DATE, USER_ID } = data;
  // START_DATE=new Date(START_DATE)
  // END_DATE=new Date(END_DATE)
  // END_DATE.setHours(23, 59, 59, 999);
  let nextDay = new Date(END_DATE);
  nextDay.setDate(nextDay.getDate() + 1);

  // if you want it back as "YYYY-MM-DD" string
  let yyyy = nextDay.getFullYear();
  let mm = String(nextDay.getMonth() + 1).padStart(2, "0");
  let dd = String(nextDay.getDate()).padStart(2, "0");
  END_DATE = `${yyyy}-${mm}-${dd}`;

  let query = "";
  if (!START_DATE || !END_DATE) {
    query = "SELECT * FROM university_events";
  } else if(START_DATE==END_DATE){
     query = `  SELECT * 
FROM university_events 
WHERE DATE(DATE) = '2025-04-20' ;
`;
  }
  
  else {
    query = `  SELECT *
FROM university_events 
WHERE DATE BETWEEN '${START_DATE}' AND '${END_DATE}';
`;
  }

  db.query(query, (err, events) => {
    if (err) return callback(err);
console.log("jkshdfkjsdhf",events)
    if (events.length === 0) {
      return callback(null, []);
    }

    // Collect all event IDs from query result
    const eventIds = events.map((event) => event.ID);

    // Now get enrolled events for this USER_ID
    const enrolledQuery = `SELECT EVENT_ID FROM enrolled_users WHERE USER_ID = ? AND EVENT_ID IN (${eventIds.join(
      ","
    )}) AND CANCELLED = FALSE`;

    db.query(enrolledQuery, [USER_ID], (err, enrolledRows) => {
      if (err) return callback(err);

      const enrolledEventIds = enrolledRows.map((row) => row.EVENT_ID);

      // Now map over events and add ENROLLED flag
      const finalEvents = events.map((event) => {
        return {
          ...event,
          ENROLLED: enrolledEventIds.includes(event.ID),
        };
      });

      // Send final result
      callback(null, finalEvents);
    });
  });
};

exports.createEvent = (data, callback) => {
  const {
    UNIVERSITY_NAME,
    LOCATION,
    TOPIC,
    PAYMENT_MODE,
    START_TIME,
    END_TIME,
    DATE,
    DESCRIPTION,
    TITLE,
  } = data;
  db.query(
    `INSERT INTO university_events (
  UNIVERSITY_NAME, LOCATION, TOPIC, PAYMENT_MODE, START_TIME, END_TIME, DATE, DESCRIPTION,
    TITLE
) VALUES (
  '${UNIVERSITY_NAME}', '${LOCATION}', '${TOPIC}', '${PAYMENT_MODE}', '${START_TIME}', '${END_TIME}', '${DATE}', '${DESCRIPTION}', '${TITLE}'
);
`,
    data,
    callback
  );
};
exports.updateEvent = (data, callback) => {
  const {
    ID,
    UNIVERSITY_NAME,
    LOCATION,
    TOPIC,
    PAYMENT_MODE,
    START_TIME,
    END_TIME,
    DATE,
  } = data;
  db.query(
    `UPDATE university_events SET
  UNIVERSITY_NAME = '${UNIVERSITY_NAME}',
  LOCATION = '${LOCATION}',
  TOPIC = '${TOPIC}',
  PAYMENT_MODE = '${PAYMENT_MODE}',
  START_TIME = '${START_TIME}',
  END_TIME = '${END_TIME}',
  DATE = '${DATE}'
WHERE ID = ${ID}`,

    data,
    callback
  );
};
exports.deleteEvent = (ID, callback) => {
  db.query(
    `DELETE FROM university_events WHERE ID = '${ID}'`,

    ID,
    callback
  );
};

exports.createTableUniversity_events = (callback) => {
  db.query(
    `CREATE TABLE university_events (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  UNIVERSITY_NAME VARCHAR(255),
  LOCATION VARCHAR(255),
  TOPIC VARCHAR(255),
  DESCRIPTION VARCHAR(255),
  TITLE VARCHAR(255),
  PAYMENT_MODE VARCHAR(50),
  START_TIME DATE,
  END_TIME DATE,
  DATE DATE,
  CANCELLED BOOLEAN DEFAULT FALSE
)`,

    callback
  );
};

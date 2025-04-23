const sessionModel = require("../models/sessionModel");
require("dotenv").config();

exports.createTable_sessions = (req, res) => {
  sessionModel.createTable_sessions((err, results) => {
    if (err) return res.status(500).send("sessions creation Error");
    return res.status(200).send("sessions created successfully");
  });
};

exports.getSessionById = (req, res) => {
  const { SESSION_ID } = req.body;
  sessionModel.getSessionById(SESSION_ID, (err, results) => {
    if (err) {
      console.log("Error in getSessionById uegfuebc: ", err);
      return res.status(500).send("DB Error");
    }
    if (results.length === 0)
      return res.status(200).send({});
    return res.status(200).send(results[0]);
  });
};

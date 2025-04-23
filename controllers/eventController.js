const eventModel = require("../models/eventModel");

exports.getAllEvents = (req, res) => {

  eventModel.getAllEvents(req.body,(err, results) => {
    if (err) {
      console.log("kjdshfjksd",err)
      return res.status(500).send("DB Error")};
    return res.status(200).send(results);
  });
};
exports.createEvent = (req, res) => {
  
  const data = req.body
  eventModel.createEvent(data,(err, results) => {
    
    if (err) return res.status(500).send("DB Error");
    return res.status(200).send("Data inserted successfully");
  });
};
exports.updateEvent = (req, res) => {
  
  const data = req.body
  eventModel.updateEvent(data, (err, results) => {
    if (err) return res.status(500).send("DB Error");
    return res.status(200).send("Data updated successfully");
  });
};
exports.deleteEvent = (req, res) => {
  
  const ID = req.body.ID
  eventModel.deleteEvent(ID, (err, results) => {
    if (err) return res.status(500).send("DB Error");
    return res.status(200).send("Data deleted successfully");
  });
};
exports.createTableUniversity_events = (req, res) => {
  eventModel.createTableUniversity_events((err, results) => {
    if (err) return res.status(500).send("university_events creation Error");
    return res.status(200).send("university_events created successfully");
  });
};

const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.post("/getAllEvents", eventController.getAllEvents);
router.post("/createEvent", eventController.createEvent);
router.post("/updateEvent", eventController.updateEvent);
router.post("/deleteEvent", eventController.deleteEvent);
router.post(
  "/createTableUniversityEvents",
  eventController.createTableUniversity_events
);

module.exports = router;

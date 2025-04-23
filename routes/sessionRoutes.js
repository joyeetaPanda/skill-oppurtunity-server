const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

router.post("/createTable_sessions", sessionController.createTable_sessions);
router.post("/getSessionById", sessionController.getSessionById);
module.exports = router;

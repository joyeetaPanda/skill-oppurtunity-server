const express = require("express");
const router = express.Router();
const enrolledUserController = require("../controllers/enrolledUserController");

router.post(
  "/createTable_enrolled_users",
  enrolledUserController.createTable_enrolled_users
);
router.post("/getEnrolledUserById", enrolledUserController.getEnrolledUserById);
router.post("/createEnrolledUser", enrolledUserController.createEnrolledUser);
router.post("/updateEnrolledUser", enrolledUserController.updateEnrolledUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/userController");

router.post("/login", authController.sendOTP);
router.post("/userLogin", authController.userLogin);
router.post("/userLogout", authController.userLogout);
router.post("/updateUser", authController.updateUser);
router.post("/getAllUsers", authController.getAllUsers);
router.post("/verify-otp", authController.verifyOTP);
router.post("/createTable_user_master", authController.createTable_user_master);

module.exports = router;

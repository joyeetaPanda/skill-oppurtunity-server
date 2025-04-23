const enrolledUserModel = require("../models/enrolledUserModel");
const sessionModel = require("../models/sessionModel");
const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

exports.getEnrolledUserById = (req, res) => {
  enrolledUserModel.getEnrolledUserById(req.body.USER_ID, (err, results) => {
    if (err) return res.status(500).send("Get all user Error");
    return res.status(200).send(results);
  });
};

exports.createEnrolledUser = (req, res) => {
  enrolledUserModel.createEnrolledUser(req.body, (err, results) => {
    if (err) return res.status(500).send("enrolled user creation Error");
    return res.status(200).send("enrolled user created successfully");
  });
};

exports.updateEnrolledUser = (req, res) => {
  enrolledUserModel.updateEnrolledUser(req.body, (err, results) => {
    if (err) {
      console.log("Error in updateEnrolledUser nhasdcjha: ", err);
      return res.status(500).send("enrolled user update Error");
    }
    return res.status(200).send("enrolled user updated successfully");
  });
};

exports.createTable_enrolled_users = (req, res) => {
  enrolledUserModel.createTable_enrolled_users((err, results) => {
    if (err) {
      console.log("Error in createTable_enrolled_users smchbsjdhb: ", err);
      return res.status(500).send("enrolled_users creation Error");
    }
    return res.status(200).send("enrolled_users created successfully");
  });
};

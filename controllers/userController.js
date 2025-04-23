const userModel = require("../models/userModel");
const sessionModel = require("../models/sessionModel");
const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

console.log("sdjfcnksdjn", process.env.MAIL_USER);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const getHTML = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #f9f9f9; max-width: 400px; margin: auto;">
      <h2 style="text-align: center; color: #333;">🔐 OTP Verification</h2>
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) is:</p>
      <div style="text-align: center; font-size: 24px; font-weight: bold; background: #e1f5fe; padding: 10px; border-radius: 8px; color: #0277bd;">
        ${otp}
      </div>
      <p style="margin-top: 20px;">Please enter this code to verify your identity. This OTP is valid for one time use only.</p>
      <p>Thank you!<br/>Team True Talent</p>
    </div>
  `;
};

exports.userLogin = (req, res) => {
  const { EMAIL, IS_VERIFIED } = req.body;
  console.log("sdjfhj", req.body);
  //verified user
  if (IS_VERIFIED === true) {
    userModel.findUserByEmail(EMAIL, (err, results) => {
      console.log("vnjfeufhri", results);
      if (err) {
        console.log("Error in findUserByEmail: ", err);
        return res.status(500).send("DB Error1");
      }
      //verified and new user
      if (results.length === 0) {
        const data = { EMAIL, IS_VERIFIED: true, NEW_USER: true, ROLES: 1 };
        userModel.createUser(data, (err, results1) => {
          if (err) return res.status(500).send("DB Error2");
          sessionModel.createSession(results1, (err, results2) => {
            if (err) {
              console.log("Error in createSession: ", err);
              return res.status(500).send("DB Error3");
            }
            console.log("Session created successfully");
            return res
              .status(200)
              .send({ login: true, ...results2, ...results1, OTP_SEND: false });
          });
        });
      } else {
        //verified and old user
        let updateData = {
          ...results[0],
          IS_VERIFIED: true,
          NEW_USER: 10,
        };
        console.log("hnsdgfjhdsg", updateData);
        userModel.updateUser(updateData, (err, results1) => {
          if (err) {
            console.log("Error in updateUser: ", err);
            return res.status(500).send("DB Error4");
          }
          sessionModel.createSession(results[0], (err, results2) => {
            if (err) {
              console.log("Error in createSession: ", err);
              return res.status(500).send("DB Error5");
            }
            console.log("Session created successfully");
            return res
              .status(200)
              .send({ login: true, ...results2, ...results1, OTP_SEND: false });
          });
        });
      }
    });
  } else {
    //unverified user
    userModel.findUserByEmail(EMAIL, (err, results) => {
      if (err) {
        console.log("Error in findUserByEmail: ", err);
        return res.status(500).send("DB Error1");
      }
      //unverified and new user
      if (results.length === 0) {
        const otp = Math.floor(100000 + Math.random() * 900000);

        const data = {
          EMAIL,
          IS_VERIFIED: false,
          OTP: otp,
          NEW_USER: true,
          ROLES: 1,
        };
        userModel.createUser(data, (err, results1) => {
          if (err) return res.status(500).send("DB Error2");
          transporter.sendMail(
            {
              from: process.env.MAIL_USER,
              to: EMAIL,
              subject: "Your OTP Code",
              // text: `Your OTP is: ${otp}`,
              html: getHTML(otp),
            },
            (err, info) => {
              if (err) {
                console.log("Error sending mail: ", err);
                return res.status(500).send("Error sending mail");
              }
              res.send({ login: false, ...results1, OTP_SEND: true });
            }
          );
        });
      } else {
        //unverified and old user
        const otp = Math.floor(100000 + Math.random() * 900000);

        let updateData = {
          ...results[0],
          OTP: otp,
          IS_VERIFIED: false,
          NEW_USER: 10,
        };
        userModel.updateUser(updateData, (err, results1) => {
          if (err) {
            console.log("Error in updateUser: ", err);
            return res.status(500).send("DB Error4");
          }

          transporter.sendMail(
            {
              from: process.env.MAIL_USER,
              to: EMAIL,
              subject: "Your OTP Code",
              // text: `Your OTP is: ${otp}`,
              html: getHTML(otp),
            },
            (err, info) => {
              if (err) {
                console.log("Error sending mail: ", err);
                return res.status(500).send("Error sending mail");
              }
              res.send({ login: false, ...results1, OTP_SEND: true });
            }
          );
        });
      }
    });
  }
};
exports.userLogout = (req, res) => {
  const { SESSION_ID } = req.body;
  sessionModel.updateSession(
    { SESSION_ID, IS_LOGGED_OUT: true },
    (err, results) => {
      if (err) {
        console.log("Error in updateSession: ", err);
        return res.status(500).send("DB Error");
      }
      console.log("Session updated successfully");
      return res.status(200).send("User logged out successfully");
    }
  );
};
exports.sendOTP = (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  userModel.findUserByEmail(email, (err, results) => {
    console.log("ekjhfiuerhfih", email);

    if (err) return res.status(500).send("DB Error");
    if (results.length === 0) return res.status(404).send("User not found");

    userModel.saveOTP(email, otp, (err) => {
      if (err) return res.status(500).send("Error saving OTP");

      transporter.sendMail(
        {
          from: process.env.MAIL_USER,
          to: email,
          subject: "Your OTP Code",
          // text: `Your OTP is: ${otp}`,
          html: getHTML(otp),
        },
        (err, info) => {
          if (err) {
            console.log("Error sending mail: ", err);
            return res.status(500).send("Error sending mail");
          }
          res.send("OTP sent to email");
        }
      );
    });
  });
};
exports.updateUser = (req, res) => {
  // Check if file is uploaded
  console.log("req.body cueygrvcegv",req.body);
  if (req.files && req.files.PROFILE_IMAGE) {
    const file = req.files.PROFILE_IMAGE;
    const fileExtension = path.extname(file.name); // Get .jpg, .png, etc.
    const fileName = `${req.body.ID}${fileExtension}`;
    const uploadPath = path.join(
      __dirname,
      "../documents/PROFILE_IMAGES",
      fileName
    );

    // Save file
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.status(500).send("File upload failed");
      }

      // Set the file URL or path in the body to save in DB
      req.body.PROFILE_IMAGE = fileName;

      // Now update the user in DB
      userModel.updateUser(req.body, (err, results) => {
        if (err) {
          console.log("Error in updateUser: ", err);
          return res.status(500).send("DB Error");
        }

        return res.status(200).send({message:"User updated successfully"});
      });
    });
  } else {
    // No file to upload, just update user
    userModel.updateUser(req.body, (err, results) => {
      if (err) {
        console.log("Error in updateUser: ", err);
        return res.status(500).send("DB Error");
      }

      return res.status(200).send({message:"User updated successfully"});
    });
  }
};
exports.verifyOTP = (req, res) => {
  const { EMAIL, OTP } = req.body;

  userModel.verifyOTP(EMAIL, OTP, (err, results) => {
    if (err) {
      console.log("Error in verifyOTP whdkwqhj`: ", err);
      return res.status(500).send("DB Error");
    }
    if (results.length === 0)
      return res.status(200).send({ login: false, message: "Invalid OTP" });
    userModel.findUserByEmail(EMAIL, (err, results1) => {
      if (err) {
        console.log("Error in findUserByEmail: ", err);
        return res.status(500).send("DB Error1");
      }

      sessionModel.createSession(results1[0], (err, results2) => {
        if (err) {
          console.log("Error in createSession: ", err);
          return res.status(500).send("DB Error3");
        }
        console.log("Session created successfully");
        req.session.user = { EMAIL };

        return res.status(200).send({
          login: true,
          message: "Session created successfully on OTP verification",
          ...results2,
          ...results1[0],
        });
      });
    });
  });
};

exports.getAllUsers = (req, res) => {
  userModel.getAllUsers((err, results) => {
    if (err) {
      console.log("Error in getAllUsers jhdfgvce: ", err);
      return res.status(500).send("Get all user Error");
    }
    return res.status(200).send(results);
  });
};
exports.createTable_user_master = (req, res) => {
  userModel.createTable_user_master((err, results) => {
    if (err) {
      console.log("Error in createTable_user_master jhsdfghjs: ", err);
      return res.status(500).send("user_master creation Error");
    }
    return res.status(200).send("user_master created successfully");
  });
};

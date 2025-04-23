const express = require("express");
const session = require("express-session");
const fs = require("node:fs");
var https = require("https");

require("dotenv").config();
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();

 const options = {
   key: fs.readFileSync("./certificate/key.pem"),
   passphrase: "rahul",
   cert: fs.readFileSync("./certificate/www_pdhanewala_com.crt"),
   ca: [
     fs.readFileSync("./certificate/AAACertificateServices.crt"),
     fs.readFileSync(
       "./certificate/SectigoRSADomainValidationSecureServerCA.crt"
     ),
   ],
 };
 var server = https.createServer(options, app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(fileUpload());

const authRoutes = require("./routes/userRoutes");
app.use("/user", authRoutes);

const eventRoutes = require("./routes/eventRoutes");
app.use("/event", eventRoutes);

const sessionRoutes = require("./routes/sessionRoutes");
app.use("/sessions", sessionRoutes);

const enrolledUserRoutes = require("./routes/enrolledUserRoutes");
app.use("/enrolledUser", enrolledUserRoutes);

app.use(express.static(__dirname + "/documents/PROFILE_IMAGES"));

server.listen(9003, () => {
  console.log("Server started on http://localhost:9000");
});

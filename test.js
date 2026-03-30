require("dotenv").config(); 

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("TLS error:", error);
  } else {
    console.log("Server is ready to take messages");
  }
});

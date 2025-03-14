const User = require('../models/User_Collection');
const { comparePassword } = require('../middleware/bcrypt');
const { hashPassword } = require('../middleware/bcrypt');
const { generateToken ,verifyToken} = require("../middleware/jwt");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

// ---------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------------------------
const signIn = async (req, res) => {
  console.log("entered signin POST form read");
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    
    if (user) {
      const isMatch = await comparePassword(password, user.pass);
      if (isMatch) {
        const dbName = email.replace(/[@.]/g, '_');
        var token = generateToken(dbName);
        res.cookie("db", token, {
            httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
              maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
          });
        
        res.json({ success: true, email: user.email });
      } 
      else {
        res.json({ success: false, message: 'Invalid password' });
      }
    } else {
      res.json({ success: false, message: "Can't find email" });
    }
  } catch (err) {
    console.error('Error during signin:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// ---------------------------------------------------------------------------------------------------------------------------------------
const logout = async (req, res) => {
  console.log("logout encountered");
  res.clearCookie("db", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
};


// ---------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------

const user_exists = async (req, res) => {
  console.log("inside userExists route");
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      console.log("user exists");
      return res.status(400).json({ message: 'Email is already registered.' });
    }
    console.log("user not registered");
    return res.status(200).json({message:'continue'});
  }
  catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const generate_otp = async (req, res) => {
  console.log("inside generateotp route");
  const { email, text } = req.body;
  console.log("email is "+email);
  console.log("text is "+text);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.user,
      pass: process.env.pass, 
    },
  });

  function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }

  const otp = generateOTP();
  
  console.log("otp is:" + otp);
  const otp_token = generateToken(otp);
  res.cookie("otp", otp_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 604800000
  });

  const mailOptions = {
    from: '"moneymind" <verify.moneymind@gmail.com>',
    to: email,
    subject: 'OTP verification!',
    text: otp +"  "+text+"\n Do not share with any body",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("not success");
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    console.log("success");
    return res.status(200).json({ message: 'OTP sent successfully' });
  });
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const verify_otp = (req,res) => {
  const otpval = req.body.otp;
  console.log('recieved otp is '+otpval);
  const otp_json = verifyToken(req.cookies.otp);
  if (!otp_json) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }
  console.log(otp_json.userId);
  if(otp_json.userId == otpval){
    console.log("otp is correct");
    res.status(200).json({message : 'otp is correct'});
  }
  else {
    console.log("otp is not correct");
    res.status(400).json({message : 'The provided OTP is incorrect. Please try again.'});
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const signUp = async (req, res) => {
  console.log("in signup POST read");
  const { email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email: email, pass: hashedPassword });
    
    const dbName = email.replace(/[@.]/g, '_');
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(dbName);
      await collection.insertOne({ message: "Collection created successfully!" });
      console.log(`Collection '${dbName}' created and document inserted.`);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
    
    await newUser.save();
    var token = generateToken(dbName);
    res.cookie("db", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
    });
    
    res.json({ email: newUser.email, message: 'Registration successful, please login' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
};


// ---------------------------------------------------------------------------------------------------------------------------------------

const reset_password = async (req,res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email});
    const hashedPassword = await hashPassword(password);
    user.pass = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------------
const is_Authenticated = async (req, res) => {
  console.log("inside Authentication");
  try {
    const token = verifyToken(req.cookies.db);
    if (token) {
      return res.status(200).json({ authenticated: true });
    } else {
      return res.status(401).json({ authenticated: false, message: "Invalid token" });
    }
  } catch (error) {
    return res.status(401).json({ authenticated: false, message: "Authentication failed" });
  }
};
// ---------------------------------------------------------------------------------------------------------------------------------------

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const google_signin = async (req, res) => {
  console.log("inside google signin");
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { sub: googleId, email, name, picture } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new user record (excluding password)
      user = new User({ email });
      await user.save();

      // Create a dedicated collection for the user
      const dbName = email.replace(/[@.]/g, '_');
      try {
        const db = mongoose.connection.db;
        const collection = db.collection(dbName);
        await collection.insertOne({ message: "Collection created successfully!" });
        console.log(`Collection '${dbName}' created and document inserted.`);
      } catch (error) {
        console.error("Error creating collection:", error);
      }
    }

    // Generate token for DB access
    const dbName = email.replace(/[@.]/g, '_');
    var token = generateToken(dbName);

    // Set db token cookie
    res.cookie("db", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
    

    return res.status(200).json({
      success: true,
      token: credential,
      user: { _id: googleId, email, name, picture },
      message: "Google sign-in successful",
    });

  } catch (error) {
    console.error("Google authentication error:", error);
    return res.status(500).json({ success: false, message: "Server error during authentication" });
  }
};


// ---------------------------------------------------------------------------------------------------------------------------------------
module.exports = {
  signIn,
  signUp,
  logout,
  user_exists,
  generate_otp,
  verify_otp,
  reset_password,
  is_Authenticated,
  google_signin
};

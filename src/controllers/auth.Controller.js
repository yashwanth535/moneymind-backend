const User_Collection = require('../models/User_Collection');
const { comparePassword } = require('../middleware/bcrypt');
const { hashPassword } = require('../middleware/bcrypt');
const nodemailer = require('nodemailer');

// ---------------------------------------------------------------------------------------------------------------------------------------
const renderSignIn = async (req, res) => {
  console.log("signin rendering");
  res.render('signin');
};
// ---------------------------------------------------------------------------------------------------------------------------------------
const renderSignUp = async (req, res) => {
  console.log("signup rendering");
  res.render('signup');
};

// ---------------------------------------------------------------------------------------------------------------------------------------
const signIn = async (req, res) => {
  console.log("entered signin POST form read");
  const { email, password } = req.body;

  try {
    const user = await User_Collection.findOne({ email: email });

    if (user) {
      const isMatch = await comparePassword(password, user.pass);
      if (isMatch) {
        req.session.user = { email: user.email };
        console.log('Created the session user ' + JSON.stringify(req.session.user));
        res.json({ success: true, email: user.email });
      } else {
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
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.redirect('/');
  });
};

// ---------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------

const user_exists=async (req, res) => {
  console.log("inside userExists route");
  const { email} = req.body;

  try {
    // Check if the user already exists
    const user = await User_Collection.findOne({ email: email });

    if (user) {
      console.log("user exists");
      return res.status(400).json({ message: 'Email is already registered.' });
    }
    return res.status(200).json({message:'continue'});

  }
  catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const generate_otp=async (req, res) => {
            
  console.log("inside generateotp route");
  const { email} = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.user,
      pass: process.env.pass, 
    },
  });

  function generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string if needed
  }

  const otp = generateOTP();
  req.session.otp = otp;
  console.log("otp is:" + otp);

  // Email options
  const mailOptions = {
    from: '"moneymind" <verify.moneymind@gmail.com>', // Corrected email format
    to: email, // Recipient's email address
    subject: 'OTP verification!', // Subject of the email
    text: otp + ' this is your one-time password to register into MoneyMind', // Plain text body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("not success");
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    console.log("success");
    return res.status(200).json({ message: 'OTP sent successfully' }); // Send a success response
  });
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const verify_otp=(req,res)=>{
  const otpval=req.body.otpval;
  if(req.session.otp==otpval){
    console.log("otp is correct");
    res.status(200).json({message : 'otp is correct'});
  }
  else {
    console.log("otp is not correct");
    res.status(400).json({message : 'The provided OTP is incorrect. Please try again.'});
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const signUp=async (req, res) => {
  console.log("in signup POST read");
  const { email, password } = req.body;

  try {
    // Hash the password before saving it
    const hashedPassword = await hashPassword(password);

    // Create a new user with the hashed password
    const newUser = new User_Collection({ email: email, pass: hashedPassword });
    await newUser.save();
    req.session.user = { email: newUser.email };

  console.log('Created the session user ' + JSON.stringify(req.session.user));

    // Send a success message
    res.json({ email: newUser.email,message: 'Registration successful, please login' });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
};
// ---------------------------------------------------------------------------------------------------------------------------------------
module.exports = {
  renderSignIn,
  renderSignUp,
  signIn,
  signUp,
  logout,
  user_exists,
  generate_otp,
  verify_otp
};

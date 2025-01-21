const User_Collection = require('../models/User_Collection');
const { comparePassword } = require('../middleware/bcrypt');
const { hashPassword } = require('../middleware/bcrypt');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// ---------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------------------------
const signIn = async (req, res) => {
  console.log("entered signin POST form read");
  const { email, password } = req.body;

  try {
    const user = await User_Collection.findOne({ email: email });
    if (user) {
      const isMatch = await comparePassword(password, user.pass);
      if (isMatch) {
        const dbName = email.replace(/[@.]/g, '_'); // Replace both `@` and `.` with `_`
        const new_url = `${process.env.URL_PARTONE}${dbName}${process.env.URL_PARTTWO}`;
        if (mongoose.connection.readyState !== 0) {
          console.log('Closing existing connection...');
          await mongoose.disconnect();
        }
        else{
          console.log("no connection already");
        }
        await mongoose.connect(new_url)
          .then(() => {
            console.log('Connected to database:', dbName);
          })
          .catch((error) => {
            console.error('Error in connection:', error.message);
          });

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
  const { email,text} = req.body;
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
    text: otp +"  "+text+"\n Do not share with any body", // Plain text body
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
  console.log('recieved otp is '+otpval);
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
    const hashedPassword = await hashPassword(password);
    const newUser = new User_Collection({ email: email, pass: hashedPassword });
    await newUser.save();
    const dbName = email.replace(/[@.]/g, '_'); // Replace both `@` and `.` with `_`
        const new_url = `${process.env.URL_PARTONE}${dbName}${process.env.URL_PARTTWO}`;
        if (mongoose.connection.readyState !== 0) {
          console.log('Closing existing connection...');
          await mongoose.disconnect();
        }
        await mongoose.connect(new_url)
          .then(() => {
            console.log('Connected to database:', dbName);
          })
          .catch((error) => {
            console.error('Error in connection:', error.message);
          });
    req.session.user = { email: newUser.email };
    console.log('Created the session user ' + JSON.stringify(req.session.user));
    res.json({ email: newUser.email,message: 'Registration successful, please login' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const reset_password=async (req,res)=>{
  const { email, password } = req.body;
  try {
    const user=await User_Collection.findOne({email});
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
module.exports = {
  signIn,
  signUp,
  logout,
  user_exists,
  generate_otp,
  verify_otp,
  reset_password
};

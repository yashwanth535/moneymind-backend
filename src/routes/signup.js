const express = require("express");
require('dotenv').config();
const router = express.Router();
const User = require("../models/User"); // Import User model here
const { hashPassword } = require('../middleware/bcrypt');
const nodemailer = require('nodemailer');

// Route to render the registration form
router.get('/', (req, res) => {
  console.log("signup rendering");
  res.render('signup');
});



router.post('/', async (req, res) => {
      console.log("in signup POST read");
      const { email, password } = req.body;

      try {
        // Check if the user already exists
        const user = await User.findOne({ email: email });

        if (user) {
          return res.status(400).json({ message: 'User already exists' });
        }


        // Hash the password before saving it
        const hashedPassword = await hashPassword(password);

        // Create a new user with the hashed password
        const newUser = new User({ email: email, pass: hashedPassword });
        await newUser.save();
        req.session.user = { email: newUser.email };

      console.log('Created the session user ' + JSON.stringify(req.session.user));

        // Send a success message
        res.json({ email: newUser.email,message: 'Registration successful, please login' });

      } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send('Internal Server Error');
      }
});



router.post('/generateOTP', (req, res) => {
            
            console.log("inside generateotp route");
            const { email} = req.body;

            const transporter = nodemailer.createTransport({
              service: 'gmail', // Using Gmail as the email service
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
                return res.status(400).json({ message: 'Enter the email correctly' });
              }
              console.log("success");
              return res.status(200).json({ message: 'OTP sent successfully' }); // Send a success response
            });
});


router.post('/verifyOTP',(req,res)=>{
          const otp=req.body;
          const otpval=otp.otpval;
          console.log("otpval:"+otpval);
          console.log("inside verification:"+(req.session.otp));
          if(req.session.otp==otpval){
            console.log("otp is correct");
            res.status(200).json({message : 'otp is correct'});
          }
          else {
            console.log("otp is not correct");
            res.status(400).json({message : 'otp is incorrect'});
          }
});


router.post('/userExists', async (req, res) => {
          console.log("inside userExists route");
          const { email} = req.body;

          try {
            // Check if the user already exists
            const user = await User.findOne({ email: email });

            if (user) {
              console.log("user exists");
              return res.status(400).json({ message: 'User already exists' });
            }
            return res.status(200).json({message:'continue'});

          }
          catch (err) {
            console.error('Error during registration:', err);
            res.status(500).send('Internal Server Error');
          }
        }
);


module.exports = router;
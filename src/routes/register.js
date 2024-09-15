const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const getExpenseModel = require("../models/expense");
const { hashPassword } = require('../middleware/bcrypt');

// Route to render the registration form
router.get('/', (req, res) => {
  res.render('register'); // Renders the 'register.hbs' template
});



router.post('/', async (req, res) => {
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
   console.log('Created the session user in register' + req.session.user);
    // Send a success message
    res.json({ email: newUser.email,message: 'Registration successful, please login' });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;



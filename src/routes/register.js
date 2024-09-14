const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const getExpenseModel = require("../models/expense");


// Route to render the registration form
router.get('/', (req, res) => {
  res.render('register'); // Renders the 'register.hbs' template
});

// Route to handle registration form submissions
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ email: email, pass: password });
    await newUser.save();

    // Send a success message
    res.json({ message: 'Registration successful, please login' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

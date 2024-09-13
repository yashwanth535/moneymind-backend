// src/login.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const getExpenseModel = require('./models/expense');
// const isAuthenticated = require('./middleware/isAuthenticated');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../template')); // Path to the 'template' folder

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve the login.hbs file when the root URL is accessed





app.get('/', (req, res) => {
  res.render('login'); // Render the 'login.hbs' file located in the 'template' folder
});


app.get('/login', (req, res) => {
  res.render('login'); // Render the 'login.hbs' file located in the 'template' folder
});


app.get('/register', (req, res) => {
  res.render('register'); // Render the 'login.hbs' file located in the 'template' folder
});


app.get('/loadhome', (req,res)=>{
  res.render("home");
});

// app.get('/home', isAuthenticated, (req, res) => {
//   res.render('home'); // Render home page if authenticated
// });

// app.get('/loadhome', (req, res) => {
//   const { email } = req.body;

//   // Here you would verify if the email is valid and if the user is authenticated
//   // For example, checking if the email exists in the database
//   User.findOne({ email: email }, (err, user) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Server error' });
//     }
//     if (user) {
//       // User is authenticated
//       res.render('home'); // Render home page
//     } else {
//       // Authentication failed
//       res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
//   });
// });






 // Specify the collection name explicitly





 app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user with matching email and hashed password
    const user = await User.findOne({ email: email, pass: password });

    if (user) {
      // req.session.user = { email: user.email };
      res.json({ success: true, email: user.email });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const user = await User.findOne({ email: email });

    if (user) {
      // If the user exists, send a JSON response
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ email: email, pass: password });
    await newUser.save();


    const Expense = getExpenseModel(email);
    // await Expense.collection.createIndex({}); // Create the collection


    // Send a success message to the client
    res.json({ message: 'Registration successful got to login' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/add-expense', async (req, res) => {
  const { email, amount, date, purpose, modeOfPayment } = req.body;

  // Validate input data
  if (!email || !amount || !date || !purpose || !modeOfPayment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Received request to add expense:', req.body);

    // Use the user-specific model
    const Expense = getExpenseModel(email);
    console.log('Expense model for email:', Expense);

    // Create a new expense
    const newExpense = new Expense({
      amount,
      date,
      purpose,
      modeOfPayment
    });

    await newExpense.save();
    console.log('Expense saved successfully.');

    res.json({ message: 'Expense added successfully' });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});







app.get('/fetch-expenses', async (req, res) => {
  const { email } = req.query; // Fetch email from query parameters

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      const Expense = getExpenseModel(email); // Dynamically get the expense model for this user

      const expenses = await Expense.find(); // Fetch all expenses for this user
      res.status(200).json(expenses);
  } catch (err) {
      console.error('Error fetching expenses:', err);
      res.status(500).json({ error: 'Error fetching expenses', details: err.message });
  }
});









const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


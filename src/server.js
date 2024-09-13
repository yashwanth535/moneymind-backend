const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../template')); // Path to the 'template' folder

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve the login.hbs file when the root URL is accessed
app.get('/', (req, res) => {
  res.render('login'); // Ensure 'login' corresponds to a valid template
});

// Start the server
const PORT = process.env.PORT || 3000; // Ensure the port number is valid
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

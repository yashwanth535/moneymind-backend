const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const getExpenseModel = require("../models/expense");




// Route for the home page
router.get('/', (req, res) => {
  // Check if the user is authenticated
  if (req.session.user) {
    console.log("rendering to home page");
    // User is authenticated, render the home page
    res.render('home', { email: req.session.user.email }); // Pass the email to the template if needed
  } else {
    console.log("not matched");
    // User is not authenticated, redirect to login page
    res.redirect('/login');
  }
});



module.exports = router;



module.exports = router;
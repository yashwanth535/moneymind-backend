const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const getExpenseModel = require("../models/expense");




// Route for the home page
router.get('/', (req, res) => {
    res.render('home', { email: req.session.user.email }); // Pass the email to the template if needed
});



module.exports = router;


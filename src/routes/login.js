const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const getExpenseModel = require("../models/expense");



router.get('/', (req, res) => {
  res.render('login'); // Render the 'login.hbs' file located in the 'template' folder
});

router.get('/loadhome', (req,res)=>{
  res.render("home");
});


 router.post('/login', async (req, res) => {
  console.log("in post");
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

module.exports = router;


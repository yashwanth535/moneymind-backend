const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const { comparePassword } = require('../middleware/bcrypt');


router.get('/', (req, res) => {
    console.log("signin rendering");
  res.render('signin'); // Render the 'signin.hbs' file located in the 'template' folder
});


router.post('/', async (req, res) => {
    console.log("entered signin POST form read");
    const { email, password } = req.body;

    try {
        // Find user with the matching email
        const user = await User.findOne({ email: email });

        if (user) {
            // Compare the provided password with the hashed password in the database
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
});

module.exports = router;



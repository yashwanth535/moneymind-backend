const express = require("express");
const router = express.Router();


router.get('/', (req, res) => {
    console.log("home rendering");
    res.render('home', { email: req.session.user.email }); 
});



module.exports = router;


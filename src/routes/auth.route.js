// routes/signin.js
const express = require("express");
const router = express.Router();
const {signIn,signUp,logout,user_exists,generate_otp, verify_otp,reset_password} = require("../controllers/auth.Controller");

router.get('/',(req,res)=>{
  res.render('landing');
  console.log("landing rendering");
});

router.get('/logout',logout);

router.post('/signin',signIn);
router.post('/userExists',user_exists);
router.post('/generateOTP',generate_otp);
router.post('/verifyOTP',verify_otp);
router.post('/signup',signUp);
router.post('/reset_password',reset_password);


module.exports = router;

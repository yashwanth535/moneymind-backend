// routes/signin.js
const express = require("express");
const router = express.Router();
const {signIn,signUp,logout,user_exists,generate_otp, verify_otp,reset_password,is_Authenticated,google_signin} = require("../controllers/auth.Controller");


router.post('/signin',signIn);
router.post('/userExists',user_exists);
router.post('/generateOTP',generate_otp);
router.post('/verifyOTP',verify_otp);
router.post('/signup',signUp);
router.post('/logout',logout);
router.post('/reset_password',reset_password);
router.post('/isAuthenticated',is_Authenticated);
router.post('/google',google_signin);


module.exports = router;

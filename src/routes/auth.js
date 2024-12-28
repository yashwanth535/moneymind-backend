// routes/signin.js
const express = require("express");
const router = express.Router();
const {renderSignIn,renderSignUp,signIn,signUp,logout,user_exists,generate_otp, verify_otp} = require("../controllers/auth.Controller");

router.get('/signin',renderSignIn);
router.get('/signup',renderSignUp);
router.get('/logout',logout);

router.post('/signin',signIn);
router.post('/userExists',user_exists);
router.post('/generateOTP',generate_otp);
router.post('/verifyOTP',verify_otp);
router.post('/signup',signUp);



module.exports = router;

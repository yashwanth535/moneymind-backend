const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const getExpenseModel = require("../models/expense");



router.get('/', (req,res)=>{
  res.render("home");
});


module.exports = router;
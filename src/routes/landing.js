const express = require("express");
const router = express.Router();

router.get('/',(req,res)=>{
  res.render('landing');
  console.log("landing rendering");
});

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getDebits,
  getCredits,
} = require("../controllers/home.Controller");

router.get("/dashboard", getDashboard);
router.get("/debits", getDebits);
router.get("/credits", getCredits);

module.exports = router;

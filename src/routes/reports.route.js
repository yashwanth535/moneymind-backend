const express = require("express");
const router = express.Router();
const { getMonthlyReport } = require("../controllers/reports.Controller");


router.get("/monthly", getMonthlyReport);

module.exports = router;

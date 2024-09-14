const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const getExpenseModel = require("../models/expense");

router.get('/', async (req, res) => {
  const { email } = req.query; // Fetch email from query parameters

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      const Expense = getExpenseModel(email); // Dynamically get the expense model for this user

      const expenses = await Expense.find(); // Fetch all expenses for this user
      res.status(200).json(expenses);
  } catch (err) {
      console.error('Error fetching expenses:', err);
      res.status(500).json({ error: 'Error fetching expenses', details: err.message });
  }
});

module.exports=router;
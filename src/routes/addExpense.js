const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const getExpenseModel = require("../models/expense");

router.get('/',(req,res)=>{
  res.render('addExpense');
});

router.post('/', async (req, res) => {
  const { email, amount, date, purpose, modeOfPayment } = req.body;

  // Validate input data
  if (!email || !amount || !date || !purpose || !modeOfPayment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Received request to add expense:', req.body);

    // Use the user-specific model
    const Expense = getExpenseModel(email);
    console.log('Expense model for email:', Expense);

    // Create a new expense
    const newExpense = new Expense({
      amount,
      date,
      purpose,
      modeOfPayment
    });

    await newExpense.save();
    console.log('Expense saved successfully.');

    res.json({ message: 'Expense added successfully' });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});


module.exports = router;
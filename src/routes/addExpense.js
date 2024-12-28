const express = require("express");
const router = express.Router();
const getExpenseModel = require("../models/expense");

router.get('/',(req,res)=>{
  console.log("add expene rendering");
  res.render('addExpense');
});

router.post('/', async (req, res) => {
  const { amount, date, purpose, modeOfPayment } = req.body;
  const email=req.session.user.email;
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
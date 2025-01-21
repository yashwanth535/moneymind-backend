const express = require("express");
const router = express.Router();
const {Debit,Credit} = require("../models/transaction.model");

router.get('/',(req,res)=>{
  console.log("add expene rendering");
  res.render('add-transaction');
});

router.post('/debit-transaction', async (req, res) => {
  const { amount, date, purpose, modeOfPayment } = req.body;
  const email=req.session.user.email;
  if (!email || !amount || !date || !purpose || !modeOfPayment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Received request to add expense:', req.body);
    const newExpense = new Debit({
      amount,
      date,
      purpose,
      modeOfPayment
    });

    await newExpense.save();
    console.log('Expense saved successfully.');

    res.json({ message: 'Debit Transaction added successfully' });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

router.post('/credit-transaction', async (req, res) => {
  console.log("inside credit route");
  const { amount, date, modeOfPayment, bank } = req.body;
  const email=req.session.user.email;
  if (!email || !amount || !date || !bank || !modeOfPayment) {
    console.log("missing fields");
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Received request to add expense:', req.body);
    const newCredit = new Credit({
      amount,
      date,
      modeOfPayment,
      bank
    });

    await newCredit.save();
    console.log('Expense saved successfully.');

    res.json({ message: 'Credit transaction added successfully' });
  } catch (err) {
    console.error('Error adding Transaction:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});


module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model here
const getExpenseModel = require("../models/expense");


router.get('/',(req,res)=>{
    console.log("fetch expense rendering");
    res.render('fetchExpense');
  });


router.get('/fetchdata', async (req, res) => {
    console.log("in fetch router get funtion");
    const email = req.session.user.email;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      const Expense = getExpenseModel(email); // Dynamically get the expense model for this user

      const expenses = await Expense.find(); // Fetch all expenses for this user
      // console.log('Fetched expenses:', expenses);
      res.status(200).json(expenses);
  } catch (err) {
      console.error('Error fetching expenses:', err);
      res.status(500).json({ error: 'Error fetching expenses', details: err.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
      const email = req.session.user.email;
      const Expense = getExpenseModel(email);

      const result = await Expense.findByIdAndDelete(req.params.id);

      if (!result) {
          return res.status(404).json({ message: 'Expense not found' });
      }

      res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
      console.error('Error deleting expense:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/edit/:id', async (req, res) => {
  try {
      const email = req.session.user.email;
      const Expense = getExpenseModel(email);

      const updatedExpense = await Expense.findByIdAndUpdate(
          req.params.id,
          {
              $set: {
                  amount: req.body.amount,
                  purpose: req.body.purpose,
                  date: req.body.date,
                  modeOfPayment: req.body.modeOfPayment,
              },
          },
          { new: true }
      );

      if (!updatedExpense) {
          return res.status(404).json({ message: 'Expense not found' });
      }

      res.status(200).json({ message: 'Expense updated successfully', updatedExpense });
  } catch (err) {
      console.error('Error updating expense:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports=router;
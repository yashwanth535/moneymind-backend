const express = require("express");
const router = express.Router();
const {Debit,Credit} = require("../models/transaction.model");


router.get('/',(req,res)=>{
    console.log("fetch expense rendering");
    res.render('fetch-transactions');
  });


router.get('/fetch-debits', async (req, res) => {
    console.log("in fetch router get funtion");
    const email = req.session.user.email;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      const expenses = await Debit.find(); // Fetch all expenses for this user
      // console.log('Fetched expenses:', expenses);
      res.status(200).json(expenses);
  } catch (err) {
      console.error('Error fetching expenses:', err);
      res.status(500).json({ error: 'Error fetching expenses', details: err.message });
  }
});

router.get('/fetch-credits', async (req, res) => {
    console.log("in fetch router get funtion");
    const email = req.session.user.email;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      const expenses = await Credit.find(); // Fetch all expenses for this user
      // console.log('Fetched expenses:', expenses);
      res.status(200).json(expenses);
  } catch (err) {
      console.error('Error fetching expenses:', err);
      res.status(500).json({ error: 'Error fetching expenses', details: err.message });
  }
});

router.delete('/delete-debit/:id', async (req, res) => {
  try {

      const result = await Debit.findByIdAndDelete(req.params.id);

      if (!result) {
          return res.status(404).json({ message: 'Expense not found' });
      }

      res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
      console.error('Error deleting expense:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/edit-debit/:id', async (req, res) => {
  try {

      const updatedExpense = await Debit.findByIdAndUpdate(
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


router.delete('/delete-credit/:id', async (req, res) => {
    try {
  
        const result = await Credit.findByIdAndDelete(req.params.id);
  
        if (!result) {
            return res.status(404).json({ message: 'Expense not found' });
        }
  
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.put('/edit-credit/:id', async (req, res) => {
    try {
  
        const updatedExpense = await Credit.findByIdAndUpdate(
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
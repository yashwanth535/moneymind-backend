const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { verifyToken } = require("../middleware/jwt");

router.post('/debit-transaction', async (req, res) => {
  const { amount, date, purpose, modeOfPayment } = req.body;
  
  // Get database name from cookie
  const token = verifyToken(req.cookies.db);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const dbName = token.userId;

  if (!amount || !date || !purpose || !modeOfPayment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Received request to add debit:', req.body);
    
    const db = mongoose.connection.db;
    const collection = db.collection(dbName);
    
    const transaction = {
      type: 'debit',
      amount,
      date,
      purpose,
      modeOfPayment,
      createdAt: new Date()
    };

    await collection.insertOne(transaction);
    console.log('Debit transaction saved successfully.');

    res.json({ message: 'Debit Transaction added successfully' });
  } catch (err) {
    console.error('Error adding debit:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

router.post('/credit-transaction', async (req, res) => {
  console.log("inside credit route");
  const { amount, date, modeOfPayment, bank } = req.body;

  // Get database name from cookie
  const token = verifyToken(req.cookies.db);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const dbName = token.userId;

  if (!amount || !date || !bank || !modeOfPayment) {
    console.log("missing fields");
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Received request to add credit:', req.body);
    
    const db = mongoose.connection.db;
    const collection = db.collection(dbName);
    
    const transaction = {
      type: 'credit',
      amount,
      date,
      modeOfPayment,
      bank,
      createdAt: new Date()
    };

    await collection.insertOne(transaction);
    console.log('Credit transaction saved successfully.');

    res.json({ message: 'Credit transaction added successfully' });
  } catch (err) {
    console.error('Error adding Transaction:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;
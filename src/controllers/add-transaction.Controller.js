const mongoose = require("mongoose");
const getExpenseModel = require("../models/Collection");
const { verifyToken } = require("../middleware/jwt");

const addDebitTransaction = async (req, res) => {
  const { amount, date, purpose, modeOfPayment } = req.body;

  // Get database name from cookie
  const token = verifyToken(req.cookies.db);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const dbName = token.userId;

  if (!amount || !date || !purpose || !modeOfPayment) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("Received request to add debit:", req.body);

    // Get the dynamic model for this user
    const ExpenseModel = getExpenseModel(dbName);

    // Create a new transaction document
    const transaction = new ExpenseModel({
      type: "debit",
      amount: Number(amount),
      date: new Date(date),
      purpose,
      modeOfPayment,
    });

    console.log("Saving transaction:", JSON.stringify(transaction, null, 2));

    // Save using Mongoose
    await transaction.save();
    console.log("Debit transaction saved successfully.");

    res.json({ message: "Debit Transaction added successfully" });
  } catch (err) {
    console.error("Error adding debit:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const addCreditTransaction = async (req, res) => {
  console.log("inside credit route");
  const { amount, date, modeOfPayment, bank } = req.body;

  // Get database name from cookie
  const token = verifyToken(req.cookies.db);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const dbName = token.userId;

  if (!amount || !date || !bank || !modeOfPayment) {
    console.log("missing fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("Received request to add credit:", req.body);

    // Get the dynamic model for this user
    const ExpenseModel = getExpenseModel(dbName);

    // Create a new transaction document
    const transaction = new ExpenseModel({
      type: "credit",
      amount: Number(amount),
      date: new Date(date),
      modeOfPayment,
      bank,
    });

    console.log("Saving transaction:", JSON.stringify(transaction, null, 2));

    // Save using Mongoose
    await transaction.save();
    console.log("Credit transaction saved successfully.");

    res.json({ message: "Credit transaction added successfully" });
  } catch (err) {
    console.error("Error adding Transaction:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

module.exports = { addDebitTransaction, addCreditTransaction };

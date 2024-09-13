const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function getExpenseModel(email) {
  const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize email
  const expenseSchema = new Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    purpose: { type: String, required: true },
    modeOfPayment: { type: String, required: true }
  });

  return mongoose.model(sanitizedEmail, expenseSchema, sanitizedEmail);
}

module.exports = getExpenseModel;

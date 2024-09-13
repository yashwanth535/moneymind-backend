

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function getExpenseModel(email) {
  // Sanitize email to create a valid model name
  const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  
  // Check if the model already exists
  if (mongoose.models[sanitizedEmail]) {
    return mongoose.models[sanitizedEmail];
  }

  // Define the expense schema
  const expenseSchema = new Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    purpose: { type: String, required: true },
    modeOfPayment: { type: String, required: true }
  });

  // Create and return the model if it doesn't exist
  return mongoose.model(sanitizedEmail, expenseSchema, sanitizedEmail);
}

module.exports = getExpenseModel;


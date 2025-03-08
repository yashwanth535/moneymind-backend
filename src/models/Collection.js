const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function getExpenseModel(email) {
  // Sanitize email to create a valid model name
  const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  
  // Check if the model already exists
  if (mongoose.models[sanitizedEmail]) {
    return mongoose.models[sanitizedEmail];
  }

  // Create an empty schema with strict: false to allow any fields
  const Email = new Schema({}, {
    strict: false,         // Allow any fields to be added
    timestamps: true,      // Add createdAt and updatedAt automatically
    versionKey: false,     // Don't include __v field
  });

  // Create and return the model
  return mongoose.model(sanitizedEmail, Email ,sanitizedEmail);
}

module.exports = getExpenseModel;
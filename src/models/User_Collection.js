
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }
});

// Create the User model
const User = mongoose.model('User', userSchema, 'users');

// Export the User model
module.exports = User;

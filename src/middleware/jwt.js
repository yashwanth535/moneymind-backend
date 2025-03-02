const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

// Function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1w", // Token expires in 1 hour
    });
};

// Function to verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null; // Invalid token
    }
};

module.exports = { generateToken, verifyToken };

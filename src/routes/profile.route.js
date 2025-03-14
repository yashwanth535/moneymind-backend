const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/jwt");
const { getProfile, createProfile, updateProfile } = require("../controllers/profile.controller");

// Middleware to verify token and add userId to request
const authMiddleware = (req, res, next) => {
  const token = verifyToken(req.cookies.db);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = token.userId;
  next();
};

// Get profile
router.get('/', authMiddleware, getProfile);

// Create profile
router.post('/', authMiddleware, createProfile);

// Update profile
router.put('/', authMiddleware, updateProfile);

module.exports = router; 
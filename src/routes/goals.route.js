const express = require('express');
const router = express.Router();
const {
  getLifetimeSavings,
  getGoals,
  createGoal,
  deleteGoal
} = require('../controllers/goals.Controller');


// Get lifetime savings
router.get('/lifetime-savings', getLifetimeSavings);

// Get all goals
router.get('/', getGoals);

// Create a new goal
router.post('/', createGoal);

// Delete a goal
router.delete('/:id', deleteGoal);

module.exports = router; 
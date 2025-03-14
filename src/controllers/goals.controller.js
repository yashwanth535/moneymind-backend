const getExpenseModel = require('../models/Collection');
const { verifyToken } = require("../middleware/jwt");

const getLifetimeSavings = async (req, res) => {
  try {
    // Get database name from cookie
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    // Get all transactions
    const transactions = await ExpenseModel.find({});

    // Calculate total income and expenses
    const totalIncome = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate lifetime savings
    const lifetimeSavings = totalIncome - totalExpenses;

    res.json({
      success: true,
      lifetimeSavings
    });
  } catch (error) {
    console.error('Error calculating lifetime savings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getGoals = async (req, res) => {
  try {
    // Get database name from cookie
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    // Find all documents with type 'goal'
    const goals = await ExpenseModel.find({ type: 'goal' }).sort({ createdAt: -1 });
    res.json({ success: true, goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, description } = req.body;

    // Get database name from cookie
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const dbName = token.userId;

    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the dynamic model for this user
    const ExpenseModel = getExpenseModel(dbName);
    
    // Create a new goal document
    const goal = new ExpenseModel({
      type: 'goal',
      title,
      targetAmount: Number(targetAmount),
      deadline: new Date(deadline),
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Saving goal:', JSON.stringify(goal, null, 2));

    await goal.save();
    res.json({ success: true, goal });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteGoal = async (req, res) => {
  try {
    // Get database name from cookie
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    await ExpenseModel.findOneAndDelete({
      _id: req.params.id,
      type: 'goal'
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getLifetimeSavings,
  getGoals,
  createGoal,
  deleteGoal
}; 
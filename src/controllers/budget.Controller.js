const getExpenseModel = require("../models/Collection");
const { verifyToken } = require("../middleware/jwt");

// Helper function to get current month's date range
const getCurrentMonthDateRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { firstDay, lastDay };
};

// Get all budgets for the current month
const getBudgets = async (req, res) => {
  try {
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    const { firstDay, lastDay } = getCurrentMonthDateRange();

    // Find all budget documents for the current month
    const budgets = await ExpenseModel.find({
      type: "budget",
      createdAt: { $lte: lastDay },
    });

    // Calculate spent amount for each budget from transactions
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await ExpenseModel.find({
          type: "debit",
          purpose: budget.category,
          date: { $gte: firstDay, $lte: lastDay },
        });

        const spent = transactions.reduce((total, trans) => total + trans.amount, 0);
        return { ...budget.toObject(), spent };
      })
    );

    res.json({ success: true, budgets: budgetsWithSpent });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create a new budget
const createBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;

    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const dbName = token.userId;

    if (!category || !amount) {
      return res.status(400).json({ success: false, message: "Please provide category and amount" });
    }

    const ExpenseModel = getExpenseModel(dbName);
    const { firstDay, lastDay } = getCurrentMonthDateRange();

    // Check if budget for this category already exists in the current month
    const existingBudget = await ExpenseModel.findOne({
      type: "budget",
      category,
      createdAt: { $gte: firstDay, $lte: lastDay },
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: "Budget for this category already exists for the current month",
      });
    }

    // Create new budget
    const budget = new ExpenseModel({
      type: "budget",
      category,
      amount: Number(amount),
      createdAt: new Date(),
    });

    await budget.save();

    // Calculate initial spent amount from existing transactions
    const transactions = await ExpenseModel.find({
      type: "debit",
      purpose: category,
      date: { $gte: firstDay, $lte: lastDay },
    });

    const spent = transactions.reduce((total, trans) => total + trans.amount, 0);
    res.json({ success: true, budget: { ...budget.toObject(), spent } });
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get budget statistics for the current month
const getBudgetStats = async (req, res) => {
  try {
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    const { firstDay, lastDay } = getCurrentMonthDateRange();

    const budgets = await ExpenseModel.find({
      type: "budget",
      createdAt: { $lte: lastDay },
    });

    const stats = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await ExpenseModel.find({
          type: "debit",
          purpose: budget.category,
          date: { $gte: firstDay, $lte: lastDay },
        });

        const spent = transactions.reduce((total, trans) => total + trans.amount, 0);
        const remaining = budget.amount - spent;
        const percentage = (spent / budget.amount) * 100;

        return {
          category: budget.category,
          amount: budget.amount,
          spent,
          remaining,
          percentage,
          isOverspent: spent > budget.amount,
          monthYear: `${firstDay.toLocaleString("default", { month: "long" })} ${firstDay.getFullYear()}`,
        };
      })
    );

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching budget stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a budget
const updateBudget = async (req, res) => {
  try {
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    const budget = await ExpenseModel.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.json({ success: true, budget });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a budget
const deleteBudget = async (req, res) => {
  try {
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    const budget = await ExpenseModel.findOneAndDelete({
      _id: req.params.id,
      type: "budget",
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getBudgets, createBudget, getBudgetStats, updateBudget, deleteBudget };

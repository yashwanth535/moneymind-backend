const { verifyToken } = require("../middleware/jwt");
const getExpenseModel = require("../models/Collection");

const getDashboard = async (req, res) => {
  try {
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    const total = await ExpenseModel.aggregate([
      { $match: { type: "debit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expenseTrend = await ExpenseModel.aggregate([
      { $match: { type: "debit" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const expenseByPurpose = await ExpenseModel.aggregate([
      { $match: { type: "debit" } },
      { $group: { _id: "$purpose", total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      total: total[0]?.total || 0,
      expenseTrend,
      expenseByPurpose,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

const getDebits = async (req, res) => {
  try {
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalDebitResult = await ExpenseModel.aggregate([
      {
        $match: {
          type: "debit",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalDebit = totalDebitResult[0]?.total || 0;

    const lastDebits = await ExpenseModel.find({ type: "debit" })
      .sort({ date: -1 })
      .limit(8)
      .select("date amount purpose modeOfPayment")
      .lean();

    const formattedLastDebits = lastDebits.map((debit) => ({
      ...debit,
      date: new Date(debit.date).toLocaleDateString(),
      amount: Number(debit.amount),
    }));

    res.status(200).json({
      totalDebit,
      lastDebits: formattedLastDebits,
    });
  } catch (err) {
    console.error("Error fetching debits:", err);
    res.status(500).json({ error: "Error fetching debits", details: err.message });
  }
};

const getCredits = async (req, res) => {
  try {
    const token = verifyToken(req.cookies.db);
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const dbName = token.userId;
    const ExpenseModel = getExpenseModel(dbName);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalCreditResult = await ExpenseModel.aggregate([
      {
        $match: {
          type: "credit",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalCredit = totalCreditResult[0]?.total || 0;

    res.status(200).json({
      totalCredit,
    });
  } catch (err) {
    console.error("Error fetching credits:", err);
    res.status(500).json({ error: "Error fetching credits", details: err.message });
  }
};

module.exports = {
  getDashboard,
  getDebits,
  getCredits,
};

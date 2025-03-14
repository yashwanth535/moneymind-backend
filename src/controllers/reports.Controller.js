const { verifyToken } = require("../middleware/jwt");
const getExpenseModel = require("../models/Collection");

const getMonthlyReport = async (req, res) => {
  console.log("\n=== Monthly Reports Route Called ===");
  try {
    console.log("Request query:", req.query);
    console.log("Request cookies:", req.cookies);

    const token = verifyToken(req.cookies.db);
    if (!token) {
      console.log("No valid token found");
      return res.status(401).json({ error: "Authentication required" });
    }
    const dbName = token.userId;
    console.log("Database name:", dbName);

    const ExpenseModel = getExpenseModel(dbName);
    console.log("Got expense model for user");

    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    console.log("Target period:", `${targetMonth + 1}/${targetYear}`);

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);

    console.log("Fetching monthly totals...");
    const monthlyTotals = await ExpenseModel.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);
    console.log("Monthly totals:", monthlyTotals);

    console.log("Fetching expense distribution...");
    const expenseByPurpose = await ExpenseModel.aggregate([
      {
        $match: {
          type: "debit",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$purpose",
          total: { $sum: "$amount" },
        },
      },
    ]);
    console.log("Expense distribution:", expenseByPurpose);

    console.log("Fetching daily trend...");
    const dailyTrend = await ExpenseModel.aggregate([
      {
        $match: {
          type: "debit",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log("Daily trend:", dailyTrend);

    console.log("Fetching payment method distribution...");
    const paymentMethodDistribution = await ExpenseModel.aggregate([
      {
        $match: {
          type: "debit",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$modeOfPayment",
          total: { $sum: "$amount" },
        },
      },
    ]);
    console.log("Payment method distribution:", paymentMethodDistribution);

    const totals = {
      debit: monthlyTotals.find((t) => t._id === "debit")?.total || 0,
      credit: monthlyTotals.find((t) => t._id === "credit")?.total || 0,
    };

    const report = {
      period: {
        month: targetMonth + 1,
        year: targetYear,
      },
      totals,
      expenseByPurpose,
      dailyTrend,
      paymentMethodDistribution,
      savings: totals.credit - totals.debit,
    };

    console.log("Sending report response");
    res.status(200).json(report);
  } catch (err) {
    console.error("\n=== Error in Monthly Reports ===");
    console.error("Time:", new Date().toISOString());
    console.error("Error:", err);
    console.error("Stack:", err.stack);
    console.error("==============================\n");
    res.status(500).json({ error: "Error generating report", details: err.message });
  }
};

module.exports = { getMonthlyReport };

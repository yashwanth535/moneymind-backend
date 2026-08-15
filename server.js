const mongoose = require('mongoose');

const {  configureApp } = require("./src/config/appConfig");
const authRoutes       = require("./src/routes/auth.route");
const addTransactionRoutes   = require("./src/routes/add-transaction.route")
const fetchTransactionRoutes = require("./src/routes/fetch-transactions.route")
const homeRoutes         = require("./src/routes/home.route")
const reportsRoute = require("./src/routes/reports.route")
const budgetRoutes = require("./src/routes/budget.route")
const profileRoutes = require("./src/routes/profile.route")
const goalsRoutes = require("./src/routes/goals.route")
const ytRoutes = require("./src/routes/yt.route")

const startServer = async () => {
const app = await configureApp();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.get("/ping", (req, res) => {
  res.status(204).end(); 
});

app.get("/api/ping", (req, res) => {
  res.send("man of the math of the tournament of the cricket")
});

app.get('/api/db', async (req, res) => {
  try {
    const readyState = mongoose.connection.readyState;
    const stateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

    if (readyState !== 1) {
      return res.status(500).json({
        status: "error",
        message: "MongoDB is not connected",
        readyState: stateMap[readyState]
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection("testdb");

    // Fetch the first (and only) document
    const document = await collection.findOne({});

    if (!document) {
      return res.status(404).json({
        status: "error",
        message: "No document found in collection"
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "MongoDB connected and document fetched",
      readyState: stateMap[readyState],
      document
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "MongoDB query failed",
      error: err.message
    });
  }
});



app.use("/api",authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/home",homeRoutes);
app.use("/api/add-transaction",addTransactionRoutes);
app.use("/api/fetch-transactions",fetchTransactionRoutes);
app.use("/api/reports", reportsRoute);
app.use("/api/budgets", budgetRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/yt", ytRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
}
startServer();

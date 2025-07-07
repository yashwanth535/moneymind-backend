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

app.get('/api/health', async (req, res) => {
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

    const ping = await mongoose.connection.db.admin().ping();

    return res.status(200).json({
      status: "ok",
      message: "MongoDB connected and responsive",
      readyState: stateMap[readyState],
      ping
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "MongoDB health check failed",
      error: err.message
    });
  }
});


app.use("/",authRoutes);
app.use("/auth", authRoutes);
app.use("/home",homeRoutes);
app.use("/add-transaction",addTransactionRoutes);
app.use("/fetch-transactions",fetchTransactionRoutes);
app.use("/reports", reportsRoute);
app.use("/budgets", budgetRoutes);
app.use("/profile", profileRoutes);
app.use("/goals", goalsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
}
startServer();

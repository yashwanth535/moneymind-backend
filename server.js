const {  configureApp } = require("./src/middleware/appConfig");
const isAuthenticated = require("./src/middleware/isAuthenticated")
const signinRoutes = require("./src/routes/signin");
const signupRoutes = require("./src/routes/signup");
const addExpenseRoutes = require("./src/routes/addExpense")
const fetchExpenseRoutes = require("./src/routes/fetchExpense")
const homeRoutes =require("./src/routes/home")
const logoutRoutes=require("./src/routes/logout");
const landingRoutes=require("./src/routes/landing");
const getExpenseModel = require("./src/models/expense");

const app = configureApp();


app.use("/", landingRoutes);
app.use("/signin", signinRoutes);
app.use("/signup",signupRoutes);
app.use("/home",isAuthenticated,homeRoutes);
app.use("/add-expense",isAuthenticated,addExpenseRoutes);
app.use("/fetch-expenses",isAuthenticated,fetchExpenseRoutes);
app.use("/logout",logoutRoutes)

app.get('/dashboard', async (req, res) => {
  const email = req.query.email;
  const Expense = getExpenseModel(email);

  try {
      const total = await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
      
      // Fetch expense trend data
      const expenseTrend = await Expense.aggregate([
          { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, total: { $sum: "$amount" } } },
          { $sort: { _id: 1 } } // Sort by date
      ]).exec();
      
      res.status(200).json({
          total: total[0]?.total || 0, // Total expenses
          expenseTrend // Send expense trend data
      });
  } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).send('Internal Server Error');
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);

});
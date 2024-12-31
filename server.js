const {  configureApp } = require("./src/middleware/appConfig");
const isAuthenticated    = require("./src/middleware/isAuthenticated")
const authRoutes       = require("./src/routes/auth");
const addExpenseRoutes   = require("./src/routes/addExpense")
const fetchExpenseRoutes = require("./src/routes/fetchExpense")
const homeRoutes         = require("./src/routes/home")



const app = configureApp();


app.use("/",authRoutes);
app.use("/auth", authRoutes);
app.use("/home",isAuthenticated,homeRoutes);
app.use("/add-expense",isAuthenticated,addExpenseRoutes);
app.use("/fetch-expenses",isAuthenticated,fetchExpenseRoutes);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});

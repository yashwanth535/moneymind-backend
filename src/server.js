const { isAuthenticated, configureApp } = require("../src/middleware/appConfig");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const addExpenseRoutes = require("./routes/addExpense")
const fetchExpenseRoutes = require("./routes/fetchExpense")
const homeRoutes =require("./routes/home")
const logoutRoutes=require("./routes/logout");

const app = configureApp();


// Use the login router for login-related routes
app.use("/", loginRoutes);
app.use("/login", loginRoutes);
app.use("/register",registerRoutes);
app.use("/home",isAuthenticated,homeRoutes);
app.use("/add-expense",isAuthenticated,addExpenseRoutes);
app.use("/fetch-expenses",isAuthenticated,fetchExpenseRoutes);
app.use("/logout",logoutRoutes)


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
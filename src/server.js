const configureApp = require("../src/middleware/appConfig");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const addExpenseRoutes = require("./routes/addExpense")
const fetchExpenseRoutes = require("./routes/fetchExpense")
const homeRoutes =require("./routes/home")

const app = configureApp();

// Use the login router for login-related routes
app.use("/", loginRoutes);
app.use("/login", loginRoutes);
app.use("/register",registerRoutes);
app.use("/add-expense",addExpenseRoutes);
app.use("/fetch-expenses",fetchExpenseRoutes);
app.use("/loadhome",homeRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
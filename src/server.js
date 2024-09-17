const {  configureApp } = require("../src/middleware/appConfig");
const isAuthenticated = require("../src/middleware/isAuthenticated")
const signinRoutes = require("./routes/signin");
const signupRoutes = require("./routes/signup");
const addExpenseRoutes = require("./routes/addExpense")
const fetchExpenseRoutes = require("./routes/fetchExpense")
const homeRoutes =require("./routes/home")
const logoutRoutes=require("./routes/logout");
const landingRoutes=require("./routes/landing");

const app = configureApp();




app.use("/", landingRoutes);
app.use("/signin", signinRoutes);
app.use("/signup",signupRoutes);
app.use("/home",isAuthenticated,homeRoutes);
app.use("/add-expense",isAuthenticated,addExpenseRoutes);
app.use("/fetch-expenses",isAuthenticated,fetchExpenseRoutes);
app.use("/logout",logoutRoutes)


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
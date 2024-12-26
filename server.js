const configureApp       = require("./src/middleware/appConfig");
const isAuthenticated    = require("./src/middleware/isAuthenticated")
const signinRoutes       = require("./src/routes/signin");
const signupRoutes       = require("./src/routes/signup");
const addExpenseRoutes   = require("./src/routes/addExpense")
const fetchExpenseRoutes = require("./src/routes/fetchExpense")
const homeRoutes         = require("./src/routes/home")
const landingRoutes      = require("./src/routes/landing");


const app = configureApp();


app.use("/",landingRoutes);
app.use("/signin", signinRoutes);
app.use("/signup",signupRoutes);
app.use("/home",isAuthenticated,homeRoutes);
app.use("/add-expense",isAuthenticated,addExpenseRoutes);
app.use("/fetch-expenses",isAuthenticated,fetchExpenseRoutes);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
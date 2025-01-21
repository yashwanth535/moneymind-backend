const {  configureApp } = require("./src/middleware/appConfig");
const isAuthenticated    = require("./src/middleware/isAuthenticated")
const authRoutes       = require("./src/routes/auth.route");
const addTransactionRoutes   = require("./src/routes/add-transaction.route")
const fetchTransactionRoutes = require("./src/routes/fetch-transactions.route")
const homeRoutes         = require("./src/routes/home.route")



const app = configureApp();


app.use("/",authRoutes);
app.use("/auth", authRoutes);
app.use("/home",isAuthenticated,homeRoutes);
app.use("/add-transaction",isAuthenticated,addTransactionRoutes);
app.use("/fetch-transactons",isAuthenticated,fetchTransactionRoutes);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});

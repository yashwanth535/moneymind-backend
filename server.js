const {  configureApp } = require("./src/config/appConfig");
const authRoutes       = require("./src/routes/auth.route");
const addTransactionRoutes   = require("./src/routes/add-transaction.route")
const fetchTransactionRoutes = require("./src/routes/fetch-transactions.route")
const homeRoutes         = require("./src/routes/home.route")



const app = configureApp();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});


app.use("/",authRoutes);
app.use("/auth", authRoutes);
app.use("/home",homeRoutes);
app.use("/add-transaction",addTransactionRoutes);
app.use("/fetch-transactons",fetchTransactionRoutes);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});

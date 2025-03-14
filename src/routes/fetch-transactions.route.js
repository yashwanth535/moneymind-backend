const express = require("express");
const router = express.Router();
const {
  fetchDebits,
  fetchCredits,
  deleteTransaction,
  editDebit,
  editCredit,
} = require("../controllers/fetch-transactions.Controller");

router.get("/fetch-debits", fetchDebits);
router.get("/fetch-credits", fetchCredits);
router.delete("/delete/:id", deleteTransaction);
router.put("/edit-debit/:id", editDebit);
router.put("/edit-credit/:id", editCredit);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  addDebitTransaction,
  addCreditTransaction,
} = require("../controllers/add-transaction.Controller");

router.post("/debit-transaction", addDebitTransaction);
router.post("/credit-transaction", addCreditTransaction);

module.exports = router;

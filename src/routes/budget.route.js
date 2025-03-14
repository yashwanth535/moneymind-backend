const express = require("express");
const router = express.Router();
const {
  getBudgets,
  createBudget,
  getBudgetStats,
  updateBudget,
  deleteBudget,
} = require("../controllers/budget.Controller");

router.get("/", getBudgets);
router.post("/", createBudget);
router.get("/stats", getBudgetStats);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;

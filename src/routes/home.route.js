const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { verifyToken } = require("../middleware/jwt");
const getExpenseModel = require("../models/Collection");

router.get('/dashboard', async (req, res) => {
    try {
        // Get database name from cookie
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;

        // Get the dynamic model for this user
        const ExpenseModel = getExpenseModel(dbName);

        // Fetch total expenses (debits only)
        const total = await ExpenseModel.aggregate([
            { $match: { type: 'debit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Fetch expense trend data for line chart (debits only)
        const expenseTrend = await ExpenseModel.aggregate([
            { $match: { type: 'debit' } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
                    total: { $sum: "$amount" } 
                } 
            },
            { $sort: { _id: 1 } }
        ]);

        // Fetch data for pie chart grouped by purpose (debits only)
        const expenseByPurpose = await ExpenseModel.aggregate([
            { $match: { type: 'debit' } },
            { $group: { _id: "$purpose", total: { $sum: "$amount" } } }
        ]);
            
        res.status(200).json({
            total: total[0]?.total || 0,
            expenseTrend,
            expenseByPurpose
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

router.get('/debits', async (req, res) => {
    try {
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;

        // Get the dynamic model for this user
        const ExpenseModel = getExpenseModel(dbName);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Calculate total debit for the month
        const totalDebitResult = await ExpenseModel.aggregate([
            {
                $match: {
                    type: 'debit',
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalDebit = totalDebitResult[0]?.total || 0;

        // Fetch the last 8 debit transactions regardless of month
        const lastDebits = await ExpenseModel.find({
            type: 'debit'
        })
        .sort({ date: -1 })
        .limit(8)
        .select('date amount purpose modeOfPayment')
        .lean();

        // Format the dates and add additional information
        const formattedLastDebits = lastDebits.map(debit => ({
            ...debit,
            date: new Date(debit.date).toLocaleDateString(),
            amount: Number(debit.amount)
        }));


        res.status(200).json({
            totalDebit,
            lastDebits: formattedLastDebits
        });
    } catch (err) {
        console.error('Error fetching debits:', err);
        res.status(500).json({ error: 'Error fetching debits', details: err.message });
    }
});

router.get('/credits', async (req, res) => {
    try {
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;

        // Get the dynamic model for this user
        const ExpenseModel = getExpenseModel(dbName);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Calculate total credit for the month
        const totalCreditResult = await ExpenseModel.aggregate([
            {
                $match: {
                    type: 'credit',
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalCredit = totalCreditResult[0]?.total || 0;

        res.status(200).json({
            totalCredit
        });
    } catch (err) {
        console.error('Error fetching credits:', err);
        res.status(500).json({ error: 'Error fetching credits', details: err.message });
    }
});

module.exports = router;
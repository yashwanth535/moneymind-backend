const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { verifyToken } = require("../middleware/jwt");

router.get('/dashboard', async (req, res) => {
    try {
        // Get database name from cookie
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;

        const db = mongoose.connection.db;
        const collection = db.collection(dbName);

        // Fetch total expenses (debits)
        const total = await collection.aggregate([
            { $match: { type: 'debit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).toArray();

        // Fetch expense trend data for line chart
        const expenseTrend = await collection.aggregate([
            { $match: { type: 'debit' } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
                    total: { $sum: "$amount" } 
                } 
            },
            { $sort: { _id: 1 } }
        ]).toArray();

        // Fetch data for pie chart grouped by purpose
        const expenseByPurpose = await collection.aggregate([
            { $match: { type: 'debit' } },
            { $group: { _id: "$purpose", total: { $sum: "$amount" } } }
        ]).toArray();

        res.status(200).json({
            total: total[0]?.total || 0,
            expenseTrend,
            expenseByPurpose
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/debits', async (req, res) => {
    try {
        // Get database name from cookie
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;

        const db = mongoose.connection.db;
        const collection = db.collection(dbName);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Calculate total debit for the month
        const totalDebit = await collection.aggregate([
            {
                $match: {
                    type: 'debit',
                    date: { 
                        $gte: startOfMonth, 
                        $lte: endOfMonth 
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]).toArray();

        // Fetch the last 8 debits
        const lastDebits = await collection.find({
            type: 'debit',
            date: { 
                $gte: startOfMonth, 
                $lte: endOfMonth 
            }
        })
        .sort({ date: -1 })
        .limit(8)
        .project({ date: 1, amount: 1 })
        .toArray();

        res.status(200).json({
            totalDebit: totalDebit[0]?.total || 0,
            lastDebits
        });
    } catch (err) {
        console.error('Error fetching debits:', err);
        res.status(500).json({ error: 'Error fetching debits', details: err.message });
    }
});

module.exports = router;


const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { verifyToken } = require("../middleware/jwt");
const { ObjectId } = require('mongodb');
const getExpenseModel = require("../models/Collection");

router.get('/fetch-debits', async (req, res) => {
    console.log("in fetch router get function");
    
    // Get database name from cookie
    const token = verifyToken(req.cookies.db);
    if (!token) {
        console.log("token not found");
        return res.status(401).json({ error: 'Authentication required' });
    }
    const dbName = token.userId;

    try {
        // Get the dynamic model for this user
        const ExpenseModel = getExpenseModel(dbName);
        
        // Fetch all debit transactions
        const transactions = await ExpenseModel.find({ type: 'debit' })
            .sort({ date: -1 })
            .lean();
            
        console.log("Found debit transactions:", transactions.length);
        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error fetching debit transactions:', err);
        res.status(500).json({ error: 'Error fetching transactions', details: err.message });
    }
});

router.get('/fetch-credits', async (req, res) => {
    console.log("in fetch router get function");
    
    // Get database name from cookie
    const token = verifyToken(req.cookies.db);
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    const dbName = token.userId;

    try {
        // Get the dynamic model for this user
        const ExpenseModel = getExpenseModel(dbName);
        
        // Fetch all credit transactions
        const transactions = await ExpenseModel.find({ type: 'credit' })
            .sort({ date: -1 })
            .lean();
            
        console.log("Found credit transactions:", transactions.length);
        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error fetching credit transactions:', err);
        res.status(500).json({ error: 'Error fetching transactions', details: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        // Get database name from cookie
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;

        // Get the dynamic model for this user
        const ExpenseModel = getExpenseModel(dbName);

        // First find the transaction to determine its type
        const transaction = await ExpenseModel.findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Delete the transaction
        const result = await ExpenseModel.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ 
            message: 'Transaction deleted successfully',
            type: transaction.type
        });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

router.put('/edit-debit/:id', async (req, res) => {
    try {
        // Get database name from cookie
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;
        console.log("dbName:", dbName);

        // Get the dynamic model for this user
        const ExpenseModel = getExpenseModel(dbName);
        
        // Log the request data
        console.log("Updating transaction with ID:", req.params.id);
        console.log("Update data:", req.body);

        // Verify if the document exists first
        const existingDoc = await ExpenseModel.findOne({
            _id: new ObjectId(req.params.id),
            type: 'debit'
        });
        
        console.log("Existing document:", existingDoc);

        if (!existingDoc) {
            console.log("No document found with ID:", req.params.id);
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const updateData = {
            amount: Number(req.body.amount),
            purpose: req.body.purpose,
            date: new Date(req.body.date),
            modeOfPayment: req.body.modeOfPayment,
            type: 'debit', // Ensure type remains debit
            updatedAt: new Date()
        };

        console.log("Update data after processing:", updateData);

        const updatedDoc = await ExpenseModel.findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        console.log("Transaction updated successfully");
        res.status(200).json({ 
            message: 'Transaction updated successfully',
            transaction: updatedDoc
        });
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

router.put('/edit-credit/:id', async (req, res) => {
    try {
        // Get database name from cookie
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;
        console.log("dbName:", dbName);

        // Get the dynamic model for this user
        const ExpenseModel = getExpenseModel(dbName);
        
        // Log the request data
        console.log("Updating transaction with ID:", req.params.id);
        console.log("Update data:", req.body);

        // Verify if the document exists first
        const existingDoc = await ExpenseModel.findOne({
            _id: new ObjectId(req.params.id),
            type: 'credit'
        });
        
        console.log("Existing document:", existingDoc);

        if (!existingDoc) {
            console.log("No document found with ID:", req.params.id);
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const updateData = {
            amount: Number(req.body.amount),
            date: new Date(req.body.date),
            modeOfPayment: req.body.modeOfPayment,
            bank: req.body.bank,
            type: 'credit', // Ensure type remains credit
            updatedAt: new Date()
        };

        console.log("Update data after processing:", updateData);
        
        const updatedDoc = await ExpenseModel.findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        console.log("Transaction updated successfully");
        res.status(200).json({ 
            message: 'Transaction updated successfully',
            transaction: updatedDoc
        });
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

module.exports = router;
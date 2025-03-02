const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { verifyToken } = require("../middleware/jwt");
const { ObjectId } = require('mongodb');

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
        const db = mongoose.connection.db;
        const collection = db.collection(dbName);
        console.log("collection is "+collection);
        const transactions = await collection.find({ type: 'debit' }).toArray();
        console.log("transactions are "+transactions);
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
        const db = mongoose.connection.db;
        const collection = db.collection(dbName);
        
        const transactions = await collection.find({ type: 'credit' }).toArray();
        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error fetching credit transactions:', err);
        res.status(500).json({ error: 'Error fetching transactions', details: err.message });
    }
});

router.delete('/delete-debit/:id', async (req, res) => {
    try {
        // Get database name from cookie
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;

        const db = mongoose.connection.db;
        const collection = db.collection(dbName);

        const result = await collection.deleteOne({
            _id: new ObjectId(req.params.id),
            type: 'debit'
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: 'Internal server error' });
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

        const db = mongoose.connection.db;
        const collection = db.collection(dbName);
        
        // Log the request data
        console.log("Updating transaction with ID:", req.params.id);
        console.log("Update data:", req.body);

        // Verify if the document exists first
        const existingDoc = await collection.findOne({
            _id: new ObjectId(req.params.id),
            type: 'debit'
        });
        
        console.log("Existing document:", existingDoc);

        if (!existingDoc) {
            console.log("No document found with ID:", req.params.id);
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const updateData = {
            amount: req.body.amount,
            purpose: req.body.purpose,
            date: req.body.date,
            modeOfPayment: req.body.modeOfPayment,
            type: 'debit', // Ensure type remains debit
            updatedAt: new Date()
        };

        console.log("Update data after processing:", updateData);

        await collection.findOneAndUpdate(
            { _id: new ObjectId(req.params.id) }, // Query filter
            { $set: updateData }, 
            { returnDocument: 'after' } // Ensures the updated document is returned
        );

        console.log("Transaction updated successfully");
        res.status(200).json({ 
            message: 'Transaction updated successfully', 
        });
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

router.delete('/delete-credit/:id', async (req, res) => {
    try {
        // Get database name from cookie
        const token = verifyToken(req.cookies.db);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const dbName = token.userId;

        const db = mongoose.connection.db;
        const collection = db.collection(dbName);

        const result = await collection.deleteOne({
            _id: new ObjectId(req.params.id),
            type: 'credit'
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: 'Internal server error' });
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

        const db = mongoose.connection.db;
        const collection = db.collection(dbName);
        
        // Log the request data
        console.log("Updating transaction with ID:", req.params.id);
        console.log("Update data:", req.body);

        // Verify if the document exists first
        const existingDoc = await collection.findOne({
            _id: new ObjectId(req.params.id),
            type: 'credit'
        });
        
        console.log("Existing document:", existingDoc);

        if (!existingDoc) {
            console.log("No document found with ID:", req.params.id);
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const updateData = {
            amount: req.body.amount,
            date: req.body.date,
            modeOfPayment: req.body.modeOfPayment,
            bank: req.body.bank,
            type: 'credit', // Ensure type remains credit
            updatedAt: new Date()
        };

        console.log("Update data after processing:", updateData);
        
        await collection.findOneAndUpdate(
            { _id: new ObjectId(req.params.id) }, // Query filter
            { $set: updateData }, 
            { returnDocument: 'after' } // Ensures the updated document is returned
        );

        console.log("Transaction updated successfully");
        res.status(200).json({ 
            message: 'Transaction updated successfully', 
        });
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

module.exports = router;
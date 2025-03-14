const { ObjectId } = require('mongodb');
const getExpenseModel = require("../models/Collection");
const { verifyToken } = require("../middleware/jwt");

const fetchDebits = async (req, res) => {
    try {
        const token = verifyToken(req.cookies.db);
        if (!token) return res.status(401).json({ error: 'Authentication required' });
        
        const ExpenseModel = getExpenseModel(token.userId);
        const query = { type: 'debit' };

        // Add purpose filter if provided
        if (req.query.purpose && req.query.purpose !== '') {
            query.purpose = req.query.purpose;
        }

        const transactions = await ExpenseModel.find(query).sort({ date: -1 }).lean();
        
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching transactions', details: err.message });
    }
};

const fetchCredits = async (req, res) => {
    try {
        const token = verifyToken(req.cookies.db);
        if (!token) return res.status(401).json({ error: 'Authentication required' });
        
        const ExpenseModel = getExpenseModel(token.userId);
        const query = { type: 'credit' };

        // Add bank filter if provided
        if (req.query.bank) {
            query.bank = req.query.bank;
        }

        const transactions = await ExpenseModel.find(query).sort({ date: -1 }).lean();
        
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching transactions', details: err.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const token = verifyToken(req.cookies.db);
        if (!token) return res.status(401).json({ error: 'Authentication required' });
        
        const ExpenseModel = getExpenseModel(token.userId);
        const transaction = await ExpenseModel.findOneAndDelete({ _id: new ObjectId(req.params.id) });

        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        
        res.status(200).json({ message: 'Transaction deleted successfully', type: transaction.type });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};

const editTransaction = async (req, res, type) => {
    try {
        const token = verifyToken(req.cookies.db);
        if (!token) return res.status(401).json({ error: 'Authentication required' });
        
        const ExpenseModel = getExpenseModel(token.userId);
        const existingDoc = await ExpenseModel.findOne({ _id: new ObjectId(req.params.id), type });
        
        if (!existingDoc) return res.status(404).json({ message: 'Transaction not found' });
        
        const updateData = { ...req.body, updatedAt: new Date(), type };
        if (updateData.amount) updateData.amount = Number(updateData.amount);
        if (updateData.date) updateData.date = new Date(updateData.date);
        
        const updatedDoc = await ExpenseModel.findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Transaction updated successfully', transaction: updatedDoc });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};

const editDebit = (req, res) => editTransaction(req, res, 'debit');
const editCredit = (req, res) => editTransaction(req, res, 'credit');

module.exports = { fetchDebits, fetchCredits, deleteTransaction, editDebit, editCredit };

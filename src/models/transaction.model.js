const mongoose = require('mongoose');
const {Schema,model} = mongoose

  const debitSchema = new Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    purpose: { type: String, required: true },
    modeOfPayment: { type: String, required: true }
  });

  const creditSchema = new Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    modeOfPayment: { type: String, required: true },
    bank: { type: String, required: true },
  });
 
  const Debit = model('debit',debitSchema)
  const Credit = model('credit',creditSchema)
module.exports ={Debit,Credit};


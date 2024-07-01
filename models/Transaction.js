const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: String, required: true },
    product: { type: String, required: true },
    amount: { type: Number, required: true },
    meter: { type: mongoose.Schema.Types.ObjectId, ref: 'Meter', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

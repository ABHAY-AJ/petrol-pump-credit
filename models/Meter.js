const mongoose = require('mongoose');

const MeterSchema = new mongoose.Schema({
    meterNumber: { type: String, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productArray: [{ type: String, required: true }]
});

module.exports = mongoose.model('Meter', MeterSchema);

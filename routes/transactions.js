const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');

router.post('/add', async (req, res) => {
    const { employee, client, product, amount, meter } = req.body;
    const newTransaction = new Transaction({ employee, client, product, amount, meter });
    await newTransaction.save();
    res.redirect('/users/dashboard');
});

router.post('/approve/:id', async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    transaction.status = 'approved';
    await transaction.save();
    res.redirect('/users/dashboard');
});

router.post('/reject/:id', async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    transaction.status = 'rejected';
    await transaction.save();

    const employee = await User.findById(transaction.employee);
    employee.salary -= transaction.amount;
    await employee.save();

    res.redirect('/users/dashboard');
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require("../models/Transaction")

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { name, email, password, role, salary } = req.body;
    try {
        const newUser = new User({ name, email, password, role });
        
        
        if (role === 'employee') {
            newUser.salary = salary;
        }
        
        await newUser.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.role = user.role;
        res.redirect('/users/dashboard');
    } else {
        
        res.render('login');
    }
});

router.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const user = await User.findById(req.session.userId);
    const transactions = await Transaction.find({ status: 'pending' });
    const employees = await User.find({ role: 'employee' });
    if (user.role === 'admin'){
        const employees = await User.find({ role: 'employee' });
        res.render('dashboard', { 
            role: req.session.role, 
            userId: req.session.userId,
            transactions,
            employees
        });
    }else{
        const employee = await User.findById(req.session.userId).populate('meters');
        res.render('dashboard', { 
            role: req.session.role, 
            userId: req.session.userId,
            transactions,
            meters: employee.meters,
            salary: employee.salary 
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;

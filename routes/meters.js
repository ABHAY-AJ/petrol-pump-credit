const express = require('express');
const router = express.Router();
const Meter = require('../models/Meter');
const User = require('../models/User');

router.post('/assign', async (req, res) => {
    const { meterNumber, employee, product } = req.body;

    try {
        // Create a new meter entry
        const newMeter = new Meter({ meterNumber, employee, product });
        await newMeter.save();

        // Find the user (employee) and update their meters array
        const user = await User.findById(employee);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the user's meters array
        user.meters.push(newMeter._id);
        await user.save();

        // Redirect to dashboard
        res.redirect('/users/dashboard');
    } catch (err) {
        console.error('Error assigning meter:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;

const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware');
const router = express.Router();

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/profile', auth, async (req, res) => {
    try {
        const { name, preferences } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (preferences) updates.preferences = preferences;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

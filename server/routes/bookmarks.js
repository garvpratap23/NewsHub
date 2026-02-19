const express = require('express');
const User = require('../models/User');
const News = require('../models/News');
const { auth } = require('../middleware');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { articleId } = req.body;
        const user = await User.findById(req.user._id);

        const index = user.bookmarks.indexOf(articleId);
        if (index > -1) {
            user.bookmarks.splice(index, 1);
        } else {
            user.bookmarks.push(articleId);
        }

        await user.save();
        res.json({ bookmarks: user.bookmarks, bookmarked: index === -1 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('bookmarks');
        res.json(user.bookmarks || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

const express = require('express');
const User = require('../models/User');
const News = require('../models/News');
const { auth, requireRole } = require('../middleware');
const router = express.Router();

router.get('/', auth, requireRole('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalArticles = await News.countDocuments();
        const publishedArticles = await News.countDocuments({ status: 'published' });
        const pendingArticles = await News.countDocuments({ status: 'pending' });
        const rejectedArticles = await News.countDocuments({ status: 'rejected' });

        const categoryStats = await News.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const recentArticles = await News.find().sort({ _id: -1 }).limit(10).select('title category status date views');

        const roleDistribution = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers, totalArticles, publishedArticles, pendingArticles, rejectedArticles,
            categoryStats, recentArticles, roleDistribution
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

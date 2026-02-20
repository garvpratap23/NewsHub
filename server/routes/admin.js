const express = require('express');
const User = require('../models/User');
const News = require('../models/News');
const { auth, requireRole } = require('../middleware');
const router = express.Router();

router.get('/stats', auth, requireRole('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAuthors = await User.countDocuments({ role: 'author' });
        const totalReaders = await User.countDocuments({ role: 'reader' });
        const totalArticles = await News.countDocuments();
        const publishedArticles = await News.countDocuments({ status: 'published' });
        const pendingArticles = await News.countDocuments({ status: 'pending' });

        // Engagement stats
        const allArticles = await News.find({}, 'likes comments');
        const totalLikes = allArticles.reduce((sum, a) => sum + (a.likes?.length || 0), 0);
        const totalComments = allArticles.reduce((sum, a) => sum + (a.comments?.length || 0), 0);

        res.json({
            totalUsers, totalAuthors, totalReaders,
            totalArticles, publishedArticles, pendingArticles,
            totalLikes, totalComments
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/users', auth, requireRole('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/users/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin user' });

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/users/:id/role', auth, requireRole('admin'), async (req, res) => {
    try {
        const { role } = req.body;
        if (!['reader', 'author', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/articles', auth, requireRole('admin'), async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;
        const articles = await News.find(query).sort({ _id: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/users/:id', auth, requireRole('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const articles = await News.find({ authorId: req.params.id }).sort({ _id: -1 });
        const totalLikes = articles.reduce((sum, a) => sum + (a.likes?.length || 0), 0);
        const totalComments = articles.reduce((sum, a) => sum + (a.comments?.length || 0), 0);

        res.json({
            user,
            articles,
            stats: {
                totalArticles: articles.length,
                publishedArticles: articles.filter(a => a.status === 'published').length,
                pendingArticles: articles.filter(a => a.status === 'pending').length,
                totalLikes,
                totalComments
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

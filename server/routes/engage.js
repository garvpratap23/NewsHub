const express = require('express');
const News = require('../models/News');
const { auth } = require('../middleware');
const router = express.Router();

router.post('/:id/like', auth, async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const userId = req.user._id;
        const index = article.likes.indexOf(userId);

        if (index === -1) {
            article.likes.push(userId);
        } else {
            article.likes.splice(index, 1);
        }

        await article.save();
        res.json({ liked: index === -1, likesCount: article.likes.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text is required' });

        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.comments.push({
            userId: req.user._id,
            userName: req.user.name,
            text: text.trim()
        });

        await article.save();
        res.json({ comments: article.comments, commentsCount: article.comments.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/comment/:commentId/reply', auth, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) return res.status(400).json({ message: 'Reply text is required' });

        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const comment = article.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        comment.replies.push({
            userId: req.user._id,
            userName: req.user.name,
            text: text.trim()
        });

        await article.save();
        res.json({ comments: article.comments, commentsCount: article.comments.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const article = await News.findById(req.params.id).select('likes comments');
        if (!article) return res.status(404).json({ message: 'Article not found' });

        res.json({
            likesCount: article.likes?.length || 0,
            likes: article.likes || [],
            commentsCount: article.comments?.length || 0,
            comments: article.comments || []
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

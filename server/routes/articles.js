const express = require('express');
const News = require('../models/News');
const { auth, requireRole } = require('../middleware');
const router = express.Router();

router.post('/', auth, requireRole('author', 'admin'), async (req, res) => {
    try {
        const { title, excerpt, category, categoryLabel, image, content, status } = req.body;
        const article = new News({
            title, excerpt, category,
            categoryLabel: categoryLabel || category.charAt(0).toUpperCase() + category.slice(1),
            image: image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800',
            content,
            author: req.user.name,
            authorAvatar: req.user.name.charAt(0).toUpperCase(),
            authorId: req.user._id,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: Math.max(1, Math.ceil((content || '').split(' ').length / 200)) + ' min read',
            views: '0',
            status: status === 'draft' ? 'draft' : 'pending'
        });
        await article.save();
        res.status(201).json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/mine', auth, requireRole('author', 'admin'), async (req, res) => {
    try {
        const articles = await News.find({ authorId: req.user._id }).sort({ _id: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', auth, requireRole('author', 'admin'), async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        if (req.user.role === 'author' && article.authorId?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only edit your own articles' });
        }

        const { title, excerpt, category, categoryLabel, image, content, status } = req.body;
        if (title) article.title = title;
        if (excerpt) article.excerpt = excerpt;
        if (category) article.category = category;
        if (categoryLabel) article.categoryLabel = categoryLabel;
        if (image) article.image = image;
        if (content) article.content = content;
        if (status) article.status = status;

        await article.save();
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id/review', auth, requireRole('admin'), async (req, res) => {
    try {
        const { status, reviewNote } = req.body;
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.status = status;
        article.reviewedBy = req.user._id;
        article.reviewNote = reviewNote || '';
        if (status === 'published') article.publishedAt = new Date();
        await article.save();
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id/publish', auth, requireRole('admin'), async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.status = 'published';
        article.publishedAt = new Date();
        await article.save();
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', auth, requireRole('author', 'admin'), async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        if (req.user.role === 'author' && article.authorId?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only delete your own articles' });
        }

        await News.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newshub';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

const News = require('./models/News');
const Trending = require('./models/Trending');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const bookmarkRoutes = require('./routes/bookmarks');
const analyticsRoutes = require('./routes/analytics');
const ttsRoutes = require('./routes/tts');
const engageRoutes = require('./routes/engage');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/engage', engageRoutes);

app.get('/api/news', async (req, res) => {
    try {
        const { category } = req.query;
        let query = { status: 'published' };
        if (category && category !== 'all') {
            query.category = category;
        }
        const news = await News.aggregate([
            { $match: query },
            { $addFields: { hasAuthor: { $cond: [{ $ifNull: ['$authorId', false] }, 1, 0] } } },
            { $sort: { hasAuthor: -1, _id: -1 } },
            { $project: { hasAuthor: 0 } }
        ]);
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/trending', async (req, res) => {
    try {
        const trending = await Trending.find();
        res.json(trending);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error('[Server Error]', err.stack || err.message);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    text: String,
    replies: [replySchema],
    createdAt: { type: Date, default: Date.now }
});

const newsSchema = new mongoose.Schema({
    title: String,
    excerpt: String,
    category: String,
    categoryLabel: String,
    image: String,
    content: { type: String, default: '' },
    author: String,
    authorAvatar: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: String,
    readTime: String,
    views: { type: String, default: '0' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    status: { type: String, enum: ['draft', 'pending', 'approved', 'published', 'rejected'], default: 'published' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote: { type: String, default: '' },
    publishedAt: { type: Date }
});

module.exports = mongoose.model('News', newsSchema);

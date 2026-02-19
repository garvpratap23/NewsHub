const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema({
    id: Number,
    title: String,
    views: String,
    comments: Number
});

module.exports = mongoose.model('Trending', trendingSchema);

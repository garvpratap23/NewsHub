const mongoose = require('mongoose');
const News = require('./models/News');
const Trending = require('./models/Trending');

const newsData = [
    {
        id: 1,
        title: "Revolutionary AI System Achieves Human-Level Understanding",
        excerpt: "Scientists announce breakthrough in artificial intelligence that could transform how machines interact with humans.",
        category: "tech",
        categoryLabel: "Technology",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
        author: "Sarah Chen",
        authorAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        date: "2 hours ago",
        readTime: "5 min read",
        views: "12.5K"
    },
    {
        id: 2,
        title: "Historic Election Results Reshape Political Landscape",
        excerpt: "Unprecedented voter turnout leads to significant changes in government composition across multiple regions.",
        category: "politics",
        categoryLabel: "Politics",
        image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600",
        author: "Michael Roberts",
        authorAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
        date: "4 hours ago",
        readTime: "8 min read",
        views: "25.3K"
    },
    {
        id: 3,
        title: "Championship Finals Break All Viewing Records",
        excerpt: "The most-watched sporting event in history captivates billions of viewers worldwide.",
        category: "sports",
        categoryLabel: "Sports",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600",
        author: "James Wilson",
        authorAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
        date: "6 hours ago",
        readTime: "4 min read",
        views: "45.7K"
    },
    {
        id: 4,
        title: "Blockbuster Film Shatters Box Office Records Opening Weekend",
        excerpt: "The highly anticipated sequel exceeds all expectations with unprecedented ticket sales globally.",
        category: "entertainment",
        categoryLabel: "Entertainment",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600",
        author: "Emily Davis",
        authorAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
        date: "8 hours ago",
        readTime: "3 min read",
        views: "18.9K"
    },
    {
        id: 5,
        title: "Tech Giants Announce Merger Worth Hundreds of Billions",
        excerpt: "The largest corporate merger in history will reshape the technology industry landscape.",
        category: "business",
        categoryLabel: "Business",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
        author: "David Kim",
        authorAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
        date: "10 hours ago",
        readTime: "6 min read",
        views: "32.1K"
    },
    {
        id: 6,
        title: "Scientists Discover New Species in Deep Ocean Expedition",
        excerpt: "Remarkable findings from the ocean floor reveal previously unknown life forms.",
        category: "tech",
        categoryLabel: "Science",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600",
        author: "Dr. Lisa Wang",
        authorAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
        date: "12 hours ago",
        readTime: "7 min read",
        views: "21.4K"
    },
    {
        id: 7,
        title: "Global Summit Addresses Climate Change Emergency",
        excerpt: "World leaders commit to aggressive new targets for carbon emission reduction.",
        category: "politics",
        categoryLabel: "World",
        image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600",
        author: "Anna Martinez",
        authorAvatar: "https://randomuser.me/api/portraits/women/7.jpg",
        date: "14 hours ago",
        readTime: "9 min read",
        views: "28.6K"
    },
    {
        id: 8,
        title: "Rising Star Athletes to Watch This Season",
        excerpt: "Young talents emerge as the next generation of sports superstars.",
        category: "sports",
        categoryLabel: "Sports",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600",
        author: "Chris Thompson",
        authorAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
        date: "16 hours ago",
        readTime: "5 min read",
        views: "15.2K"
    },
    {
        id: 9,
        title: "Award Show Surprises With Historic Wins",
        excerpt: "Breakthrough artists and films dominate this year's prestigious awards ceremony.",
        category: "entertainment",
        categoryLabel: "Entertainment",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
        author: "Rachel Green",
        authorAvatar: "https://randomuser.me/api/portraits/women/9.jpg",
        date: "18 hours ago",
        readTime: "4 min read",
        views: "22.8K"
    }
];

const trendingData = [
    { id: 1, title: "Cryptocurrency reaches new all-time high amid institutional adoption", views: "125K", comments: 892 },
    { id: 2, title: "Space tourism company announces first civilian mission to Mars", views: "98K", comments: 654 },
    { id: 3, title: "Major cybersecurity breach affects millions of users worldwide", views: "87K", comments: 521 },
    { id: 4, title: "Revolutionary medical breakthrough promises cure for rare diseases", views: "76K", comments: 432 },
    { id: 5, title: "Global shipping crisis impacts holiday shopping season", views: "65K", comments: 321 }
];

async function seedDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/newshub');
        console.log('Connected to MongoDB for seeding');

        await News.deleteMany({});
        await News.insertMany(newsData);
        console.log('News data seeded');

        await Trending.deleteMany({});
        await Trending.insertMany(trendingData);
        console.log('Trending data seeded');

        mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seedDB();

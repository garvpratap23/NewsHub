// Seed script: Fetches real news from Perplexity and saves to MongoDB
// Run: node seed-news.js

require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');

const categories = ['world', 'politics', 'technology', 'sports', 'entertainment', 'business', 'science', 'health'];

const categoryImages = {
    world: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
        'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600',
        'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600',
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600',
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
        'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=600',
        'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600',
        'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600',
        'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600',
        'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
        'https://images.unsplash.com/photo-1559827291-baf8b5f65e5f?w=600',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600'
    ],
    politics: [
        'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600',
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600',
        'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600',
        'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=600',
        'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600',
        'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=600',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600',
        'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600',
        'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=600',
        'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600',
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
        'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?w=600',
        'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=600',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600',
        'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600'
    ],
    technology: [
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600',
        'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
        'https://images.unsplash.com/photo-1565220427215-5571230b744b?w=600',
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600'
    ],
    sports: [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600',
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600',
        'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600',
        'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600',
        'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600',
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600',
        'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600',
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600',
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600',
        'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?w=600',
        'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600',
        'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600'
    ],
    entertainment: [
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
        'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600',
        'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600',
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600',
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600',
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600',
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600',
        'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600',
        'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600',
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600'
    ],
    business: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600',
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
        'https://images.unsplash.com/photo-1553729459-afe8f2e2ed55?w=600',
        'https://images.unsplash.com/photo-1560472355-536de3962603?w=600',
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600',
        'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=600',
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600'
    ],
    science: [
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
        'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600',
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600',
        'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600',
        'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
        'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600',
        'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600',
        'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=600',
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600',
        'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600',
        'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=600',
        'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
        'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600'
    ],
    health: [
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
        'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600',
        'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        'https://images.unsplash.com/photo-1576039716094-066beef36943?w=600',
        'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
        'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=600',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600',
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600'
    ]
};

const authorNames = [
    'Sarah Chen', 'Michael Roberts', 'James Wilson', 'Emily Davis', 'David Kim',
    'Dr. Lisa Wang', 'Anna Martinez', 'Chris Thompson', 'Rachel Green', 'Alex Turner',
    'Sophia Anderson', 'Marcus Lee', 'Natalie Cruz', 'Ryan Mitchell', 'Priya Patel'
];

async function callPerplexity(prompt) {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'sonar',
            messages: [
                {
                    role: 'system',
                    content: 'You are a news API. Return ONLY valid JSON arrays. No markdown, no code blocks, no explanations. Just pure JSON.'
                },
                { role: 'user', content: prompt }
            ],
            max_tokens: 6000,
            temperature: 0.3
        })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

function parseJsonArray(text) {
    // Try direct parse first
    try { return JSON.parse(text); } catch (e) {}

    // Remove markdown code fences
    let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Try to extract array
    try {
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (match) return JSON.parse(match[0]);
    } catch (e) {}

    // Try line-by-line object extraction
    try {
        const objects = [];
        const objRegex = /\{[^{}]*"title"[^{}]*\}/g;
        let m;
        while ((m = objRegex.exec(cleaned)) !== null) {
            try {
                objects.push(JSON.parse(m[0]));
            } catch (e) {}
        }
        if (objects.length > 0) return objects;
    } catch (e) {}

    return [];
}

async function seedCategory(cat) {
    console.log(`\n📡 Fetching 15 articles for "${cat}"...`);

    const prompt = `Return a JSON array of 15 recent real news stories about "${cat}".
Each object must have exactly these fields: "title" (string), "excerpt" (string, 2 sentences), "content" (string, 3-4 paragraphs).
Use only real current news events. Return ONLY the JSON array, nothing else.`;

    try {
        const text = await callPerplexity(prompt);
        const articles = parseJsonArray(text);

        if (articles.length === 0) {
            console.log(`Could not parse response for "${cat}" - raw length: ${text.length}`);
            console.log(`  First 200 chars: ${text.substring(0, 200)}`);
            return 0;
        }

        const images = categoryImages[cat] || categoryImages.world;
        const now = new Date();
        let saved = 0;

        for (let i = 0; i < Math.min(articles.length, 15); i++) {
            const a = articles[i];
            if (!a.title) continue;
            try {
                await News.create({
                    title: a.title,
                    excerpt: a.excerpt || a.title,
                    category: cat,
                    categoryLabel: cat.charAt(0).toUpperCase() + cat.slice(1),
                    image: images[i % images.length],
                    content: a.content || a.excerpt || '',
                    author: authorNames[i % authorNames.length],
                    authorAvatar: authorNames[i % authorNames.length].charAt(0),
                    date: new Date(now - (i * 3600000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    readTime: `${Math.floor(Math.random() * 7) + 3} min read`,
                    views: `${(Math.random() * 50 + 5).toFixed(1)}K`,
                    status: 'published',
                    publishedAt: new Date(now - (i * 3600000))
                });
                saved++;
            } catch (err) {
                console.log(`Failed: ${a.title?.substring(0, 50)}`);
            }
        }

        console.log(`Saved ${saved} articles for "${cat}"`);
        return saved;
    } catch (err) {
        console.log(`API error for "${cat}": ${err.message}`);
        return 0;
    }
}

async function main() {
    console.log('NewsHub Seed Script\n');

    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'newshub' });
    console.log('Connected to MongoDB Atlas');

    const deleted = await News.deleteMany({ authorId: { $exists: false } });
    console.log(`Cleaned ${deleted.deletedCount} old seeded articles`);

    let total = 0;
    for (const cat of categories) {
        const count = await seedCategory(cat);
        total += count;
        await new Promise(r => setTimeout(r, 3000));
    }

    console.log(`\nDone! Seeded ${total} articles across ${categories.length} categories.`);

    const dbCount = await News.countDocuments();
    console.log(`Total articles in database: ${dbCount}`);

    process.exit(0);
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});

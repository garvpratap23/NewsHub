const express = require('express');
const { auth } = require('../middleware');
const News = require('../models/News');
const router = express.Router();

async function callGroq(prompt, maxTokens = 1000) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            temperature: 0.8
        })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

async function callPerplexity(prompt, maxTokens = 4000) {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'sonar',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens
        })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

function parseJsonArray(text) {
    try {
        const match = text.match(/\[[\s\S]*\]/);
        if (match) return JSON.parse(match[0]);
    } catch (e) { }
    return [];
}

router.post('/generate-title', auth, async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        const prompt = `You are a professional news editor. The user wrote this draft title for a ${category || 'news'} article: "${title}"

Generate 3 improved, attention-grabbing, professional news headline alternatives. Each should be concise (under 15 words), compelling, and SEO-friendly.

Return ONLY a JSON array of 3 strings, nothing else. Example: ["Title 1", "Title 2", "Title 3"]`;

        const content = await callGroq(prompt, 300);
        const titles = parseJsonArray(content);
        res.json({ titles: titles.length > 0 ? titles : [title] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/enhance-content', auth, async (req, res) => {
    try {
        const { content, tone } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const toneDescriptions = {
            professional: 'professional, formal, and authoritative — like a top journalist at Reuters or BBC',
            casual: 'casual, conversational, and easy-to-read — like a blog post for a general audience',
            sarcastic: 'witty and sarcastic — with clever observations and ironic humor throughout',
            funny: 'humorous and entertaining — with jokes, puns, and a lighthearted approach',
            academic: 'academic and research-oriented — with detailed analysis and scholarly language',
            dramatic: 'dramatic and intense — with vivid descriptions and emotional storytelling'
        };

        const toneDesc = toneDescriptions[tone] || toneDescriptions.professional;

        const prompt = `You are an expert content writer. Rewrite and enhance the following article content in a ${tone} tone. The tone should be ${toneDesc}.

Original content:
${content}

Rules:
- Keep the core facts and information intact
- Improve the writing quality, flow, and engagement
- Make it ${tone} in tone throughout
- Add appropriate transitions between paragraphs
- Output ONLY the enhanced article text, no preamble or meta-commentary`;

        const enhanced = await callGroq(prompt, 2000);
        res.json({ content: enhanced });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/generate-excerpt', auth, async (req, res) => {
    try {
        const { content, title } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const prompt = `You are a professional news editor. Generate a compelling 1-2 sentence excerpt/summary for this article.

Title: ${title || 'Untitled'}
Content: ${content.substring(0, 1500)}

The excerpt should:
- Be engaging and make readers want to read more
- Capture the key point of the article
- Be between 20-40 words
- Be written in present tense

Return ONLY the excerpt text, nothing else.`;

        const excerpt = await callGroq(prompt, 200);
        res.json({ excerpt: excerpt.replace(/^["']|["']$/g, '').trim() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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
        'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
        'https://images.unsplash.com/photo-1576039716094-066beef36943?w=600',
        'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
        'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=600',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600',
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600'
    ]
};

const authorNames = [
    'Sarah Chen', 'Michael Roberts', 'James Wilson', 'Emily Davis', 'David Kim',
    'Dr. Lisa Wang', 'Anna Martinez', 'Chris Thompson', 'Rachel Green', 'Alex Turner',
    'Sophia Anderson', 'Marcus Lee', 'Natalie Cruz', 'Ryan Mitchell', 'Priya Patel'
];

router.get('/live-news', async (req, res) => {
    try {
        const { category } = req.query;
        const topic = category || 'world';

        const prompt = `You are a news aggregator. Give me exactly 15 of the most recent and important REAL news stories about "${topic}" from the last 24 hours. Use actual real events happening right now in the world.

For each story provide:
- title: a compelling headline (real news, not made up)
- excerpt: 2 sentence summary of the story
- category: "${topic}"

IMPORTANT: Return ONLY a valid JSON array with exactly 15 objects, each having "title", "excerpt", and "category" fields. No markdown, no explanation, just the JSON array.`;

        const content = await callPerplexity(prompt, 4000);
        let articles = parseJsonArray(content);

        // Ensure we have articles and format them properly
        const images = categoryImages[topic] || categoryImages.world;
        const now = new Date();

        articles = articles.slice(0, 15).map((a, i) => ({
            title: a.title || 'Breaking News',
            excerpt: a.excerpt || a.summary || 'Latest developments in this story...',
            category: topic,
            categoryLabel: topic.charAt(0).toUpperCase() + topic.slice(1),
            image: images[i % images.length],
            author: authorNames[i % authorNames.length],
            authorAvatar: authorNames[i % authorNames.length].charAt(0),
            date: i < 3 ? `${i + 1}h ago` : i < 8 ? `${i + 2}h ago` : `${i + 5}h ago`,
            readTime: `${Math.floor(Math.random() * 7) + 3} min read`,
            views: `${(Math.random() * 50 + 5).toFixed(1)}K`,
            isLive: true
        }));

        res.json(articles);
    } catch (err) {
        console.error('Live news fetch error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

router.get('/live-trending', async (req, res) => {
    try {
        const prompt = `Give me exactly 5 trending news topics right now globally. For each provide: title (short headline), views (random number like "125K"), comments (random number).

Return ONLY a valid JSON array with 5 objects, each having "title", "views", and "comments" fields. No markdown, just JSON.`;

        const content = await callPerplexity(prompt, 1000);
        let trending = parseJsonArray(content);

        trending = trending.slice(0, 5).map((t, i) => ({
            id: i + 1,
            title: t.title || 'Trending Topic',
            views: t.views || `${Math.floor(Math.random() * 150 + 50)}K`,
            comments: t.comments || Math.floor(Math.random() * 800 + 200)
        }));

        res.json(trending);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/recommendations', auth, async (req, res) => {
    try {
        const preferences = req.user.preferences || [];
        const prompt = preferences.length > 0
            ? `Give me 5 trending news headlines about: ${preferences.join(', ')}. Format as JSON array with fields: title, excerpt, category.`
            : `Give me 5 trending global news headlines right now. Format as JSON array with fields: title, excerpt, category.`;

        const content = await callPerplexity(prompt, 1000);
        const recommendations = parseJsonArray(content);
        res.json(recommendations.length > 0 ? recommendations : [{ title: 'Loading recommendations...', excerpt: 'Check back soon', category: 'general' }]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

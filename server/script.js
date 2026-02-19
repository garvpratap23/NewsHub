// News Data
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

// DOM Elements
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const loader = document.querySelector('.loader');
const header = document.querySelector('header');
const ticker = document.querySelector('.ticker');
const newsGrid = document.getElementById('newsGrid');
const trendingScroll = document.getElementById('trendingScroll');
const categoryTabs = document.querySelectorAll('.category-tab');
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const backToTop = document.getElementById('backToTop');
const scrollProgress = document.querySelector('.scroll-progress');
const toast = document.getElementById('toast');
const articleModal = document.getElementById('articleModal');
const articleClose = document.getElementById('articleClose');
const weatherWidget = document.getElementById('weatherWidget');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const pageTransition = document.querySelector('.page-transition');
const newsletterForm = document.getElementById('newsletterForm');
const magneticElements = document.querySelectorAll('.magnetic');

// Cursor Movement
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursorFollower.style.left = cursorX + 'px';
    cursorFollower.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor Hover Effects
const hoverElements = document.querySelectorAll('a, button, .news-card, .trending-card, .featured-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

document.addEventListener('mousedown', () => cursor.classList.add('click'));
document.addEventListener('mouseup', () => cursor.classList.remove('click'));

// Magnetic Effect
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
    });
});

// Ripple Effect
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.querySelector('.ripple');
    if (ripple) ripple.remove();

    button.appendChild(circle);
}

document.querySelectorAll('.btn, .category-tab, .subscribe-btn, .newsletter-btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
});

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';

        setTimeout(() => {
            ticker.classList.add('show');
            weatherWidget.classList.add('show');
        }, 500);
    }, 2500);
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to Top Button
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Scroll Progress
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = window.scrollY / scrollHeight;
    scrollProgress.style.transform = `scaleX(${scrollPercent})`;
});

// Back to Top
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Search Overlay
searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    document.getElementById('searchInput').focus();
});

searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
});

// Mobile Menu
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Page Transitions
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        pageTransition.classList.add('active');

        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 1000);
    });
});

// Render News Cards
function renderNewsCards(filter = 'all') {
    const filteredNews = filter === 'all'
        ? newsData
        : newsData.filter(news => news.category === filter);

    newsGrid.innerHTML = filteredNews.map((news, index) => `
        <article class="news-card" data-id="${news.id}" style="transition-delay: ${index * 0.1}s">
            <div style="overflow: hidden; border-radius: 20px 20px 0 0;">
                <img src="${news.image}" alt="${news.title}" class="news-card-image">
                <div class="news-card-overlay"></div>
            </div>
            <div class="news-card-body">
                <span class="news-card-category ${news.category}">${news.categoryLabel}</span>
                <h3 class="news-card-title">${news.title}</h3>
                <p class="news-card-excerpt">${news.excerpt}</p>
                <div class="news-card-footer">
                    <div class="news-card-author">
                        <img src="${news.authorAvatar}" alt="${news.author}" class="author-avatar">
                        <span class="author-name">${news.author}</span>
                    </div>
                    <div class="news-card-actions">
                        <button class="card-action bookmark-btn" data-id="${news.id}">
                            <i class="far fa-bookmark"></i>
                        </button>
                        <button class="card-action share-btn" data-id="${news.id}">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `).join('');

    // Observe cards for animation
    observeCards();

    // Add click handlers
    addCardHandlers();
}

// Render Trending Cards
function renderTrendingCards() {
    trendingScroll.innerHTML = trendingData.map((item, index) => `
        <article class="trending-card">
            <span class="trending-number">${String(index + 1).padStart(2, '0')}</span>
            <h3 class="trending-title">${item.title}</h3>
            <div class="trending-stats">
                <span class="trending-stat"><i class="far fa-eye"></i> ${item.views}</span>
                <span class="trending-stat"><i class="far fa-comment"></i> ${item.comments}</span>
            </div>
        </article>
    `).join('');
}

// Intersection Observer for Cards
function observeCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.news-card').forEach(card => {
        observer.observe(card);
    });
}

// Add Card Click Handlers
function addCardHandlers() {
    // News card click
    document.querySelectorAll('.news-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-action')) {
                const id = card.dataset.id;
                const news = newsData.find(n => n.id == id);
                openArticleModal(news);
            }
        });
    });

    // Bookmark button
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            btn.classList.toggle('bookmarked');
            showToast('Article saved to bookmarks');
        });
    });

    // Share button
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showToast('Link copied to clipboard!');
        });
    });
}

// Category Tabs
categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderNewsCards(tab.dataset.category);
    });
});

// Open Article Modal
function openArticleModal(news) {
    document.getElementById('articleImage').src = news.image;
    document.getElementById('articleCategory').textContent = news.categoryLabel;
    document.getElementById('articleTitle').textContent = news.title;
    document.getElementById('articleAuthor').textContent = news.author;
    document.getElementById('articleDate').textContent = news.date;
    document.getElementById('articleViews').textContent = news.views + ' views';
    document.getElementById('articleBody').innerHTML = `
        <p>${news.excerpt}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    `;

    articleModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Article Modal
articleClose.addEventListener('click', () => {
    articleModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Show Toast
function showToast(message) {
    toast.querySelector('p').textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Newsletter Form
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Successfully subscribed to newsletter!');
    newsletterForm.reset();
});

// Animate on Scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animateOnScroll.observe(el);
});

// Search Tags
document.querySelectorAll('.search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.getElementById('searchInput').value = tag.textContent;
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchOverlay.classList.remove('active');
        articleModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroGradients = document.querySelectorAll('.hero-bg-gradient');
    heroGradients.forEach((gradient, index) => {
        const speed = index === 0 ? 0.5 : 0.3;
        gradient.style.transform = `translate(0, ${scrolled * speed}px)`;
    });
});

// Dynamic Time Update
function updateTimes() {
    // In a real app, this would update relative times
}
setInterval(updateTimes, 60000);

// Initialize
renderNewsCards();
renderTrendingCards();

// Smooth Scroll for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Trending Scroll Animation
trendingScroll.addEventListener('wheel', (e) => {
    e.preventDefault();
    trendingScroll.scrollLeft += e.deltaY;
});

// Live Update Simulation
setInterval(() => {
    const badge = document.querySelector('.featured-badge');
    if (badge) {
        badge.style.opacity = badge.style.opacity === '0' ? '1' : '0';
        setTimeout(() => {
            badge.style.opacity = '1';
        }, 500);
    }
}, 5000);
// Mock data generator for Amazon product intelligence

const mockProducts = {
    'B08N5WRWNW': {
        asin: 'B08N5WRWNW',
        title: 'Apple AirPods Pro (2nd Generation) Wireless Ear Buds with USB-C Charging, Up to 2X More Active Noise Cancelling Bluetooth Headphones, Transparency Mode, Adaptive Audio, Personalized Spatial Audio',
        price: 249.00,
        originalPrice: 279.99,
        currency: 'USD',
        rating: 4.6,
        totalReviews: 87432,
        imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
        category: 'Electronics > Headphones > Earbud Headphones',
        bsr: 3,
        bsrCategory: 'Electronics',
        inStock: true,
        seller: 'Amazon.com',
        brand: 'Apple',
        firstAvailable: '2023-09-15',

        // Sales data (estimated monthly sales for last 12 months)
        salesHistory: [
            { month: '2024-02', units: 145000, revenue: 32625000 },
            { month: '2024-03', units: 156000, revenue: 35100000 },
            { month: '2024-04', units: 142000, revenue: 31950000 },
            { month: '2024-05', units: 138000, revenue: 31050000 },
            { month: '2024-06', units: 151000, revenue: 33975000 },
            { month: '2024-07', units: 148000, revenue: 33300000 },
            { month: '2024-08', units: 159000, revenue: 35775000 },
            { month: '2024-09', units: 167000, revenue: 37575000 },
            { month: '2024-10', units: 172000, revenue: 38700000 },
            { month: '2024-11', units: 189000, revenue: 42525000 },
            { month: '2024-12', units: 215000, revenue: 48375000 },
            { month: '2025-01', units: 178000, revenue: 40050000 }
        ],

        // Price history (last 12 months)
        priceHistory: [
            { date: '2024-02-01', price: 249.00 },
            { date: '2024-03-01', price: 249.00 },
            { date: '2024-04-01', price: 239.00 },
            { date: '2024-05-01', price: 229.00 },
            { date: '2024-06-01', price: 239.00 },
            { date: '2024-07-01', price: 249.00 },
            { date: '2024-08-01', price: 249.00 },
            { date: '2024-09-01', price: 249.00 },
            { date: '2024-10-01', price: 249.00 },
            { date: '2024-11-01', price: 199.00 },
            { date: '2024-12-01', price: 189.00 },
            { date: '2025-01-01', price: 249.00 }
        ],

        // BSR history
        bsrHistory: [
            { date: '2024-02-01', rank: 5 },
            { date: '2024-03-01', rank: 4 },
            { date: '2024-04-01', rank: 6 },
            { date: '2024-05-01', rank: 7 },
            { date: '2024-06-01', rank: 5 },
            { date: '2024-07-01', rank: 4 },
            { date: '2024-08-01', rank: 3 },
            { date: '2024-09-01', rank: 2 },
            { date: '2024-10-01', rank: 2 },
            { date: '2024-11-01', rank: 1 },
            { date: '2024-12-01', rank: 1 },
            { date: '2025-01-01', rank: 3 }
        ],

        // Review distribution
        reviewDistribution: {
            5: 62458,
            4: 18234,
            3: 4123,
            2: 1567,
            1: 1050
        },

        // Sentiment analysis
        sentiment: {
            positive: 78,
            neutral: 15,
            negative: 7,
            themes: {
                positive: ['Sound quality', 'Noise cancellation', 'Comfort', 'Battery life', 'Build quality'],
                negative: ['Price', 'Fit issues', 'Connectivity', 'Case scratches']
            }
        },

        // Fake review indicators
        fakeReviewRisk: 'Low',
        fakeReviewScore: 12, // Out of 100

        // Listing quality
        listingQuality: {
            score: 92,
            factors: {
                titleOptimization: 95,
                imageQuality: 100,
                aPlusContent: true,
                videoPresent: true,
                bulletPoints: 5,
                descriptionLength: 850
            }
        },

        // Competitors
        competitors: [
            {
                asin: 'B0CHWRXH8B',
                title: 'Sony WF-1000XM5',
                price: 299.99,
                rating: 4.5,
                reviews: 12453,
                bsr: 8
            },
            {
                asin: 'B0D1XD1ZV3',
                title: 'Samsung Galaxy Buds2 Pro',
                price: 229.99,
                rating: 4.4,
                reviews: 34521,
                bsr: 15
            },
            {
                asin: 'B09K7K8Q8V',
                title: 'Bose QuietComfort Earbuds II',
                price: 279.00,
                rating: 4.3,
                reviews: 8932,
                bsr: 22
            }
        ]
    },

    'B0BSHF7WHW': {
        asin: 'B0BSHF7WHW',
        title: 'SAMSUNG Galaxy S24 Ultra Cell Phone, 256GB AI Smartphone, Unlocked Android, 200MP, 100x Zoom Cameras, Long Battery Life, S Pen, US Version, 2024, Titanium Gray',
        price: 1299.99,
        originalPrice: 1499.99,
        currency: 'USD',
        rating: 4.7,
        totalReviews: 23567,
        imageUrl: 'https://m.media-amazon.com/images/I/71ZOHJw+WiL._AC_SL1500_.jpg',
        category: 'Electronics > Cell Phones > Smartphones',
        bsr: 12,
        bsrCategory: 'Cell Phones & Accessories',
        inStock: true,
        seller: 'Amazon.com',
        brand: 'Samsung',
        firstAvailable: '2024-01-20',

        salesHistory: [
            { month: '2024-02', units: 45000, revenue: 58500000 },
            { month: '2024-03', units: 52000, revenue: 67600000 },
            { month: '2024-04', units: 48000, revenue: 62400000 },
            { month: '2024-05', units: 42000, revenue: 54600000 },
            { month: '2024-06', units: 38000, revenue: 49400000 },
            { month: '2024-07', units: 35000, revenue: 45500000 },
            { month: '2024-08', units: 41000, revenue: 53300000 },
            { month: '2024-09', units: 44000, revenue: 57200000 },
            { month: '2024-10', units: 47000, revenue: 61100000 },
            { month: '2024-11', units: 56000, revenue: 72800000 },
            { month: '2024-12', units: 68000, revenue: 88400000 },
            { month: '2025-01', units: 51000, revenue: 66300000 }
        ],

        priceHistory: [
            { date: '2024-02-01', price: 1299.99 },
            { date: '2024-03-01', price: 1299.99 },
            { date: '2024-04-01', price: 1299.99 },
            { date: '2024-05-01', price: 1249.99 },
            { date: '2024-06-01', price: 1249.99 },
            { date: '2024-07-01', price: 1199.99 },
            { date: '2024-08-01', price: 1299.99 },
            { date: '2024-09-01', price: 1299.99 },
            { date: '2024-10-01', price: 1299.99 },
            { date: '2024-11-01', price: 1099.99 },
            { date: '2024-12-01', price: 999.99 },
            { date: '2025-01-01', price: 1299.99 }
        ],

        bsrHistory: [
            { date: '2024-02-01', rank: 8 },
            { date: '2024-03-01', rank: 6 },
            { date: '2024-04-01', rank: 9 },
            { date: '2024-05-01', rank: 12 },
            { date: '2024-06-01', rank: 15 },
            { date: '2024-07-01', rank: 18 },
            { date: '2024-08-01', rank: 14 },
            { date: '2024-09-01', rank: 11 },
            { date: '2024-10-01', rank: 10 },
            { date: '2024-11-01', rank: 7 },
            { date: '2024-12-01', rank: 5 },
            { date: '2025-01-01', rank: 12 }
        ],

        reviewDistribution: {
            5: 16532,
            4: 5234,
            3: 1123,
            2: 456,
            1: 222
        },

        sentiment: {
            positive: 82,
            neutral: 12,
            negative: 6,
            themes: {
                positive: ['Camera quality', 'Display', 'S Pen', 'Performance', 'Battery'],
                negative: ['Price', 'Size/weight', 'Heating issues']
            }
        },

        fakeReviewRisk: 'Low',
        fakeReviewScore: 8,

        listingQuality: {
            score: 95,
            factors: {
                titleOptimization: 90,
                imageQuality: 100,
                aPlusContent: true,
                videoPresent: true,
                bulletPoints: 6,
                descriptionLength: 1200
            }
        },

        competitors: [
            {
                asin: 'B0CMDW1VBV',
                title: 'Apple iPhone 15 Pro Max',
                price: 1199.00,
                rating: 4.8,
                reviews: 45632,
                bsr: 5
            },
            {
                asin: 'B0CX56KD99',
                title: 'Google Pixel 8 Pro',
                price: 999.00,
                rating: 4.5,
                reviews: 12345,
                bsr: 18
            }
        ]
    }
};

// Parse Amazon product URL to extract ASIN
function parseAmazonUrl(url) {
    // Common Amazon URL patterns
    const patterns = [
        /\/dp\/([A-Z0-9]{10})/,
        /\/gp\/product\/([A-Z0-9]{10})/,
        /\/product\/([A-Z0-9]{10})/,
        /amazon\.[a-z.]+\/([A-Z0-9]{10})/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }

    return null;
}

// Generate realistic mock data for any ASIN
function generateMockData(asin) {
    // Random but seeded data based on ASIN
    const seed = asin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let seedValue = seed;
    const seededRandom = (min, max) => {
        seedValue = (seedValue * 9301 + 49297) % 233280;
        const rnd = seedValue / 233280;
        return Math.floor(rnd * (max - min + 1)) + min;
    };

    const productTitles = [
        'Premium Wireless Headphones with Active Noise Cancellation, Bluetooth 5.0, 30-Hour Battery Life',
        'Smart Watch for Men Women, Fitness Tracker with Heart Rate Monitor, Waterproof Activity Tracker',
        'Portable Bluetooth Speaker, Waterproof Wireless Speaker with 360° Sound, 24H Playtime',
        'Gaming Mouse RGB, 16000 DPI Programmable Gaming Mice with 8 Buttons for PC Computer',
        'USB C Hub Multiport Adapter, 7-in-1 Type C Hub with 4K HDMI, 3 USB 3.0 Ports',
        'Laptop Stand for Desk, Adjustable Ergonomic Aluminum Computer Stand for MacBook',
        'Mechanical Keyboard RGB Backlit, Wired Gaming Keyboard with Blue Switches',
        'Webcam 1080P Full HD with Microphone, USB Computer Camera for Video Conferencing',
        'Phone Case with Card Holder, Leather Wallet Case with Kickstand for Smartphone',
        'Car Phone Mount, Dashboard Windshield Cell Phone Holder with Strong Suction Cup'
    ];

    const brands = ['TechPro', 'SmartGear', 'ProMax', 'EliteSound', 'PowerTech', 'UltraGadget', 'PremiumTech', 'NextGen'];
    const categories = [
        'Electronics > Accessories',
        'Electronics > Audio',
        'Electronics > Computers',
        'Cell Phones & Accessories',
        'Sports & Outdoors',
        'Home & Kitchen',
        'Office Products'
    ];

    const price = seededRandom(20, 500);
    const originalPrice = price + seededRandom(10, 100);
    const rating = (seededRandom(35, 50) / 10).toFixed(1);
    const totalReviews = seededRandom(500, 50000);
    const bsr = seededRandom(5, 500);

    // Generate 12 months of sales history
    const salesHistory = [];
    const priceHistory = [];
    const bsrHistory = [];
    const baseUnits = seededRandom(5000, 50000);

    const months = ['2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01'];

    months.forEach((month, index) => {
        const variance = seededRandom(-20, 20) / 100;
        const seasonalBoost = (index === 10 || index === 11) ? 1.3 : 1;
        const units = Math.floor(baseUnits * (1 + variance) * seasonalBoost);

        salesHistory.push({
            month: month,
            units: units,
            revenue: units * price
        });

        const priceVariance = seededRandom(-15, 5);
        priceHistory.push({
            date: month + '-01',
            price: Math.max(price - 50, price + priceVariance)
        });

        bsrHistory.push({
            date: month + '-01',
            rank: Math.max(1, bsr + seededRandom(-20, 20))
        });
    });

    // Review distribution
    const total5Star = Math.floor(totalReviews * seededRandom(55, 75) / 100);
    const total4Star = Math.floor(totalReviews * seededRandom(15, 25) / 100);
    const total3Star = Math.floor(totalReviews * seededRandom(5, 10) / 100);
    const total2Star = Math.floor(totalReviews * seededRandom(2, 5) / 100);
    const total1Star = totalReviews - total5Star - total4Star - total3Star - total2Star;

    const positivePercent = seededRandom(70, 90);
    const negativePercent = seededRandom(5, 15);
    const neutralPercent = 100 - positivePercent - negativePercent;

    const positiveThemes = ['Great quality', 'Good value', 'Fast shipping', 'Easy to use', 'Works well'];
    const negativeThemes = ['Price', 'Durability issues', 'Setup difficulty', 'Customer service'];

    const competitors = [];
    for (let i = 0; i < 3; i++) {
        competitors.push({
            asin: 'COMP' + seededRandom(10000, 99999),
            title: productTitles[seededRandom(0, productTitles.length - 1)].substring(0, 60) + '...',
            price: price + seededRandom(-50, 50),
            rating: (seededRandom(35, 48) / 10).toFixed(1),
            reviews: seededRandom(1000, 30000),
            bsr: bsr + seededRandom(-10, 30)
        });
    }

    return {
        asin: asin,
        title: productTitles[seededRandom(0, productTitles.length - 1)],
        price: price,
        originalPrice: originalPrice,
        currency: 'USD',
        rating: parseFloat(rating),
        totalReviews: totalReviews,
        imageUrl: 'https://via.placeholder.com/500x500/1a1a2e/ffffff?text=' + encodeURIComponent(asin),
        category: categories[seededRandom(0, categories.length - 1)],
        bsr: bsr,
        bsrCategory: categories[seededRandom(0, categories.length - 1)].split('>')[0].trim(),
        inStock: seededRandom(0, 10) > 1,
        seller: 'Amazon.com',
        brand: brands[seededRandom(0, brands.length - 1)],
        firstAvailable: '2023-' + seededRandom(1, 12).toString().padStart(2, '0') + '-15',
        salesHistory: salesHistory,
        priceHistory: priceHistory,
        bsrHistory: bsrHistory,
        reviewDistribution: {
            5: total5Star,
            4: total4Star,
            3: total3Star,
            2: total2Star,
            1: total1Star
        },
        sentiment: {
            positive: positivePercent,
            neutral: neutralPercent,
            negative: negativePercent,
            themes: {
                positive: positiveThemes.slice(0, seededRandom(3, 5)),
                negative: negativeThemes.slice(0, seededRandom(2, 4))
            }
        },
        fakeReviewRisk: seededRandom(0, 100) < 80 ? 'Low' : seededRandom(0, 100) < 50 ? 'Medium' : 'High',
        fakeReviewScore: seededRandom(5, 25),
        listingQuality: {
            score: seededRandom(75, 98),
            factors: {
                titleOptimization: seededRandom(80, 100),
                imageQuality: seededRandom(85, 100),
                aPlusContent: seededRandom(0, 100) > 30,
                videoPresent: seededRandom(0, 100) > 40,
                bulletPoints: seededRandom(4, 6),
                descriptionLength: seededRandom(500, 1500)
            }
        },
        competitors: competitors,
        isDemoData: true  // Flag to indicate this is generated demo data
    };
}

// Get mock product data
function getMockProductData(asin) {
    // Return predefined data if available, otherwise generate it
    if (mockProducts[asin]) {
        return mockProducts[asin];
    }

    // Generate realistic mock data for any ASIN
    console.log('🎲 Generating mock data for ASIN:', asin);
    return generateMockData(asin);
}

// Calculate average from array
function calculateAverage(arr, key) {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((acc, item) => acc + (key ? item[key] : item), 0);
    return Math.round(sum / arr.length);
}

// Format number with commas
function formatNumber(num) {
    return num.toLocaleString('en-US');
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

// Calculate percentage
function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

// Get trend indicator
function getTrend(current, previous) {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
}

// Get example products for demo
function getExampleProducts() {
    return Object.keys(mockProducts);
}

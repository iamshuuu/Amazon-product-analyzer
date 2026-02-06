import express from 'express';
import AmazonScraper from '../scrapers/amazon-scraper.js';
import BrowserScraper from '../scrapers/browser-scraper.js';
import RapidAPIScraper from '../scrapers/rapidapi-scraper.js';
import SalesEstimator from '../services/sales-estimator.js';
import ReviewAnalyzer from '../services/review-analyzer.js';
import { mockProducts } from '../data/fallback-data.js';

const router = express.Router();

// Choose scraper based on environment variables (priority: RapidAPI > Browser > Basic)
const useRapidAPI = process.env.USE_RAPIDAPI === 'true';
const useBrowserScraper = process.env.USE_BROWSER_SCRAPER === 'true';

let scraper;
if (useRapidAPI) {
    scraper = new RapidAPIScraper();
    console.log('🚀 Using RapidAPI scraper (Fast & Reliable)');
} else if (useBrowserScraper) {
    scraper = new BrowserScraper();
    console.log('🔧 Using Browser (Puppeteer) scraper');
} else {
    scraper = new AmazonScraper();
    console.log('🔧 Using Basic (Axios) scraper');
}

const salesEstimator = new SalesEstimator();
const reviewAnalyzer = new ReviewAnalyzer();

// Get complete product analysis
router.get('/product/:asin', async (req, res) => {
    try {
        const { asin } = req.params;

        console.log('API Request: Analyzing product', asin);

        let productData = null;
        let usedFallback = false;
        let reviewAnalysis = null; // Declare at the start to avoid undefined errors

        // Try to scrape product data
        try {
            productData = await scraper.scrapeProduct(asin);

            // Check if scraping actually worked (Amazon blocks and returns empty data)
            if (!productData.title || productData.title === 'Product Title Not Found' || productData.price === 0) {
                console.log(`⚠️ Scraping blocked for ${asin}, using fallback data`);
                productData = mockProducts[asin];
                usedFallback = true;

                if (!productData) {
                    throw new Error('Product not found in fallback data either');
                }
            } else {
                // Successfully scraped real data - now fetch real reviews!
                console.log(`📊 Fetching reviews for ${asin}...`);
                try {
                    // Fetch 2 pages for fast response (20-40 reviews is enough for analysis)
                    // 10 pages was too slow (10-20 seconds), 2 pages = 2-4 seconds
                    const reviews = await scraper.scrapeReviews ?
                        await scraper.scrapeReviews(asin, 2) : [];

                    if (reviews && reviews.length > 0) {
                        console.log(`✅ Fetched ${reviews.length} reviews for analysis`);
                        reviewAnalysis = reviewAnalyzer.analyzeReviews(reviews);
                    } else {
                        console.log(`⚠️ No reviews found, using estimated review data`);
                        reviewAnalysis = reviewAnalyzer.getDefaultAnalysis();
                    }
                } catch (reviewError) {
                    console.log(`⚠️ Error fetching reviews: ${reviewError.message}`);
                    reviewAnalysis = reviewAnalyzer.getDefaultAnalysis();
                }
            }
        } catch (error) {
            console.log(`⚠️ Scraping error for ${asin}: ${error.message}`);
            console.log('Attempting to use fallback data...');
            productData = mockProducts[asin];
            usedFallback = true;

            if (!productData) {
                return res.status(404).json({
                    error: 'Product not found',
                    message: 'Unable to fetch product data and no fallback available',
                    suggestion: 'Try using one of the example products: B08N5WRWNW (AirPods Pro) or B0BSHF7WHW (Samsung S24 Ultra)',
                    asin: asin
                });
            }
        }

        // Analyze reviews if we haven't already (from real scraping above)
        if (!reviewAnalysis) {
            if (productData.reviews && productData.reviews.length > 0) {
                reviewAnalysis = reviewAnalyzer.analyzeReviews(productData.reviews);
            } else if (usedFallback) {
                // Use estimated review distribution for fallback data
                const total = productData.totalReviews;
                reviewAnalysis = {
                    distribution: {
                        5: Math.floor(total * 0.71),
                        4: Math.floor(total * 0.21),
                        3: Math.floor(total * 0.05),
                        2: Math.floor(total * 0.02),
                        1: Math.floor(total * 0.01)
                    },
                    sentiment: {
                        positive: 78,
                        neutral: 15,
                        negative: 7,
                        themes: {
                            positive: ['Sound quality', 'Comfort', 'Battery life', 'Build quality'],
                            negative: ['Price', 'Fit issues']
                        }
                    },
                    fakeReviewRisk: 'Low',
                    fakeReviewScore: 12
                };
            } else {
                reviewAnalysis = reviewAnalyzer.getDefaultAnalysis();
            }
        }

        // Generate sales estimates
        const salesHistory = salesEstimator.generateSalesHistory(
            productData.bsr || 100,
            productData.bsrCategory,
            12
        );

        const salesWithRevenue = salesEstimator.calculateRevenue(
            salesHistory,
            productData.price
        );

        // Generate BSR history
        const bsrHistory = salesEstimator.generateBSRHistory(productData.bsr || 100, 12);

        // Generate price history (simulated for now)
        const priceHistory = generatePriceHistory(productData.price, 12);

        // Calculate listing quality
        const listingQuality = calculateListingQuality(productData);

        // Find competitors (placeholder - would need more sophisticated search)
        const competitors = generateMockCompetitors(productData);

        // Build complete response
        const response = {
            asin: productData.asin,
            title: productData.title,
            price: productData.price,
            originalPrice: productData.originalPrice,
            currency: 'USD',
            rating: productData.rating,
            totalReviews: productData.totalReviews,
            imageUrl: productData.imageUrl,
            category: productData.category,
            bsr: productData.bsr,
            bsrCategory: productData.bsrCategory,
            inStock: productData.inStock,
            seller: productData.seller,
            brand: productData.brand,
            salesHistory: salesWithRevenue,
            priceHistory: priceHistory,
            bsrHistory: bsrHistory,
            reviewDistribution: reviewAnalysis.distribution,
            sentiment: reviewAnalysis.sentiment,
            fakeReviewRisk: reviewAnalysis.fakeReviewRisk,
            fakeReviewScore: reviewAnalysis.fakeReviewScore,
            listingQuality: listingQuality,
            competitors: competitors,
            scrapedAt: productData.scrapedAt || new Date().toISOString(),
            _meta: {
                dataSource: usedFallback ? 'fallback' : 'scraped',
                note: usedFallback ? '⚠️ Amazon blocked scraping, using demo data' : 'Live scraped data'
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Error in /product/:asin:', error);
        res.status(500).json({
            error: 'Failed to analyze product',
            message: error.message,
            asin: req.params.asin
        });
    }
});

// Helper function to generate price history
function generatePriceHistory(currentPrice, months) {
    const history = [];
    const monthDates = [
        '2024-02-01', '2024-03-01', '2024-04-01', '2024-05-01', '2024-06-01',
        '2024-07-01', '2024-08-01', '2024-09-01', '2024-10-01', '2024-11-01',
        '2024-12-01', '2025-01-01'
    ];

    for (let i = 0; i < months; i++) {
        const variance = (Math.random() - 0.5) * 0.15;
        const seasonalDiscount = (i >= 10) ? 0.85 : 1.0; // Holiday discounts
        const price = Math.round(currentPrice * (1 + variance) * seasonalDiscount * 100) / 100;

        history.push({
            date: monthDates[i],
            price: Math.max(currentPrice * 0.7, price)
        });
    }

    return history;
}

// Helper function to calculate listing quality
function calculateListingQuality(product) {
    let score = 0;
    const factors = {};

    // Title optimization (based on length and keyword density)
    const titleLength = product.title.length;
    factors.titleOptimization = titleLength >= 100 && titleLength <= 200 ? 95 :
        titleLength >= 50 ? 80 : 60;
    score += factors.titleOptimization * 0.2;

    // Image quality (we have an image)
    factors.imageQuality = product.imageUrl ? 95 : 0;
    score += factors.imageQuality * 0.15;

    // Features/bullet points
    factors.bulletPoints = product.features ? product.features.length : 0;
    const bulletScore = Math.min(100, (factors.bulletPoints / 6) * 100);
    score += bulletScore * 0.15;

    // Description
    factors.descriptionLength = product.description ? product.description.length : 0;
    const descScore = factors.descriptionLength >= 500 ? 90 :
        factors.descriptionLength >= 200 ? 70 : 40;
    score += descScore * 0.15;

    // A+ Content (estimate based on description length)
    factors.aPlusContent = factors.descriptionLength > 800;
    score += factors.aPlusContent ? 15 : 0;

    // Video (placeholder)
    factors.videoPresent = Math.random() > 0.6;
    score += factors.videoPresent ? 10 : 0;

    // Brand presence
    const hasBrand = product.brand && product.brand !== 'Unknown Brand';
    score += hasBrand ? 10 : 0;

    return {
        score: Math.round(Math.min(100, score)),
        factors: factors
    };
}

// Helper to generate mock competitors
function generateMockCompetitors(product) {
    // In a real implementation, this would search Amazon for similar products
    return [{
        asin: 'COMP' + Math.floor(Math.random() * 100000),
        title: 'Similar Product - Competitor Alternative',
        price: product.price * (0.85 + Math.random() * 0.3),
        rating: 4.0 + Math.random() * 0.8,
        reviews: Math.floor(Math.random() * 20000) + 5000,
        bsr: product.bsr ? product.bsr + Math.floor(Math.random() * 50) - 10 : 100
    }];
}

export default router;

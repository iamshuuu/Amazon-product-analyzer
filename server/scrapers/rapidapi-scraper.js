import axios from 'axios';

class RapidAPIScraper {
    constructor() {
        this.apiKey = process.env.RAPIDAPI_KEY;
        this.apiHost = process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com';
        this.country = process.env.AMAZON_COUNTRY || 'US';
        this.baseUrl = `https://${this.apiHost}`;
    }

    async makeRequest(endpoint, params = {}) {
        try {
            const response = await axios.request({
                method: 'GET',
                url: `${this.baseUrl}${endpoint}`,
                params: { ...params, country: this.country },
                headers: {
                    'x-rapidapi-key': this.apiKey,
                    'x-rapidapi-host': this.apiHost
                },
                timeout: 30000
            });

            return response.data;
        } catch (error) {
            console.error(`❌ RapidAPI error (${endpoint}):`, error.message);
            throw new Error(`RapidAPI request failed: ${error.message}`);
        }
    }

    parseCurrency(priceString) {
        if (!priceString) return { amount: 0, currency: 'USD' };

        const currencyMap = {
            '$': 'USD',
            '₹': 'INR',
            '£': 'GBP',
            '€': 'EUR',
            '¥': 'JPY',
            'CA$': 'CAD',
            'A$': 'AUD',
            'R$': 'BRL'
        };

        // Detect currency symbol
        let currency = 'USD';
        for (const [symbol, code] of Object.entries(currencyMap)) {
            if (priceString.includes(symbol)) {
                currency = code;
                break;
            }
        }

        // Extract numeric value
        const amount = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;

        return { amount, currency };
    }

    async scrapeProduct(asin) {
        console.log(`🔍 Fetching product from RapidAPI: ${asin}`);

        try {
            const data = await this.makeRequest('/product-details', { asin });

            if (!data || !data.data) {
                throw new Error('Invalid API response');
            }

            const product = data.data;
            const priceInfo = this.parseCurrency(product.product_price);
            const originalPriceInfo = this.parseCurrency(product.product_original_price || product.product_price);

            // Map API response to our product structure
            const mappedProduct = {
                asin: asin,
                title: product.product_title || 'Product Title Not Found',
                price: priceInfo.amount,
                originalPrice: originalPriceInfo.amount,
                currency: priceInfo.currency,
                rating: parseFloat(product.product_star_rating) || 0,
                totalReviews: parseInt(product.product_num_ratings) || 0,
                imageUrl: product.product_photo || '',
                category: this.extractCategory(product),
                bsr: this.extractBSR(product),
                bsrCategory: this.extractBSRCategory(product),
                inStock: product.product_availability !== 'OUT_OF_STOCK',
                seller: product.sales_volume || 'Amazon',
                brand: product.brand || 'Unknown Brand',
                features: this.extractFeatures(product),
                description: product.about_product?.join(' ') || product.product_description || '',
                scrapedAt: new Date().toISOString()
            };

            console.log(`✅ Successfully fetched: ${mappedProduct.title.substring(0, 50)}...`);
            console.log(`   Price: ${mappedProduct.currency} ${mappedProduct.price}`);
            console.log(`   Rating: ${mappedProduct.rating} (${mappedProduct.totalReviews} reviews)`);

            return mappedProduct;

        } catch (error) {
            console.error(`❌ Error fetching product ${asin}:`, error.message);
            throw error;
        }
    }

    async scrapeReviews(asin, maxPages = 3) {
        console.log(`📊 Fetching reviews from RapidAPI: ${asin}`);

        try {
            const reviews = [];

            for (let page = 1; page <= maxPages; page++) {
                const data = await this.makeRequest('/product-reviews', {
                    asin,
                    page: page.toString(),
                    sort_by: 'TOP_REVIEWS',
                    star_rating: 'ALL',
                    verified_purchases_only: 'false'
                });

                if (!data || !data.data || !data.data.reviews) {
                    break;
                }

                const pageReviews = data.data.reviews.map(review => ({
                    rating: parseFloat(review.review_star_rating) || 0,
                    title: review.review_title || '',
                    text: review.review_comment || '',
                    date: review.review_date || '',
                    verified: review.is_verified_purchase || false,
                    helpful: parseInt(review.helpful_vote_statement?.match(/(\d+)/)?.[1] || '0')
                }));

                reviews.push(...pageReviews);

                if (pageReviews.length === 0) break;
            }

            console.log(`✅ Total reviews fetched: ${reviews.length}`);
            return reviews;

        } catch (error) {
            console.error(`❌ Error fetching reviews:`, error.message);
            return [];
        }
    }

    extractCategory(product) {
        if (product.product_information?.categories) {
            return product.product_information.categories.join(' > ');
        }
        return product.category_path || 'Unknown Category';
    }

    extractBSR(product) {
        if (product.bestsellers_rank && product.bestsellers_rank.length > 0) {
            const rank = product.bestsellers_rank[0].rank;
            return parseInt(rank?.replace(/[^0-9]/g, '')) || null;
        }
        return null;
    }

    extractBSRCategory(product) {
        if (product.bestsellers_rank && product.bestsellers_rank.length > 0) {
            return product.bestsellers_rank[0].category || 'Unknown';
        }
        return 'Unknown';
    }

    extractFeatures(product) {
        if (product.about_product && Array.isArray(product.about_product)) {
            return product.about_product;
        }
        if (product.feature_bullets && Array.isArray(product.feature_bullets)) {
            return product.feature_bullets;
        }
        return [];
    }
}

export default RapidAPIScraper;

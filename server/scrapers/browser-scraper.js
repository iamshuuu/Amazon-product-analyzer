import puppeteer from 'puppeteer';

class BrowserScraper {
    constructor() {
        this.domain = process.env.AMAZON_DOMAIN || 'amazon.com';
        this.baseUrl = `https://www.${this.domain}`;
        this.browser = null;
        this.headless = process.env.HEADLESS_MODE !== 'false';
    }

    async init() {
        if (!this.browser) {
            console.log('🚀 Launching browser...');
            this.browser = await puppeteer.launch({
                headless: this.headless,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--window-size=1920,1080'
                ]
            });
        }
        return this.browser;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    randomDelay(min = 1000, max = 3000) {
        const delay = Math.random() * (max - min) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    async scrapeProduct(asin) {
        const url = `${this.baseUrl}/dp/${asin}`;
        console.log(`🔍 Scraping product with browser: ${asin}`);

        let page;
        try {
            await this.init();
            page = await this.browser.newPage();

            // Set realistic viewport
            await page.setViewport({
                width: 1920,
                height: 1080,
                deviceScaleFactor: 1
            });

            // Block unnecessary resources for faster loading
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            // Set user agent
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            );

            // Navigate to product page
            console.log(`📄 Navigating to: ${url}`);
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Random delay to mimic human behavior
            await this.randomDelay(1000, 2000);

            // Scroll page slightly
            await page.evaluate(() => {
                window.scrollBy(0, Math.random() * 500 + 200);
            });

            await this.randomDelay(500, 1000);

            // Extract product data
            const product = await page.evaluate(() => {
                const getText = (selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.textContent.trim() : '';
                };

                const getPrice = () => {
                    let price = 0;
                    const priceWhole = document.querySelector('.a-price.priceToPay .a-price-whole');
                    const priceFraction = document.querySelector('.a-price.priceToPay .a-price-fraction');

                    if (priceWhole) {
                        const whole = priceWhole.textContent.trim().replace(/[^0-9]/g, '');
                        const fraction = priceFraction ? priceFraction.textContent.trim() : '00';
                        price = parseFloat(`${whole}.${fraction}`);
                    }

                    if (!price) {
                        const priceText = getText('.a-price-whole');
                        if (priceText) {
                            price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                        }
                    }

                    return price || 0;
                };

                const getCurrency = () => {
                    const symbol = getText('.a-price-symbol');
                    const currencyMap = {
                        '$': 'USD', '₹': 'INR', '£': 'GBP', '€': 'EUR',
                        '¥': 'JPY', 'CA$': 'CAD', 'A$': 'AUD', 'R$': 'BRL'
                    };
                    return currencyMap[symbol] || 'USD';
                };

                const getRating = () => {
                    const ratingText = getText('span.a-icon-alt');
                    const match = ratingText.match(/(\d+\.?\d*)/);
                    return match ? parseFloat(match[1]) : 0;
                };

                const getReviewCount = () => {
                    const reviewText = getText('#acrCustomerReviewText');
                    const match = reviewText.match(/([\d,]+)/);
                    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
                };

                const getBSR = () => {
                    const elements = Array.from(document.querySelectorAll('#detailBulletsWrapper_feature_div li, #productDetails_detailBullets_sections1 tr'));
                    for (const el of elements) {
                        const text = el.textContent;
                        if (text.includes('Best Sellers Rank')) {
                            const match = text.match(/#([\d,]+)/);
                            return match ? parseInt(match[1].replace(/,/g, '')) : null;
                        }
                    }
                    return null;
                };

                const getBSRCategory = () => {
                    const elements = Array.from(document.querySelectorAll('#detailBulletsWrapper_feature_div li, #productDetails_detailBullets_sections1 tr'));
                    for (const el of elements) {
                        const text = el.textContent;
                        if (text.includes('Best Sellers Rank')) {
                            const match = text.match(/in\s+([^(#]+)/);
                            return match ? match[1].trim() : 'Unknown';
                        }
                    }
                    return 'Unknown';
                };

                return {
                    title: getText('#productTitle') || 'Product Title Not Found',
                    price: getPrice(),
                    originalPrice: parseFloat(getText('.a-price.a-text-price .a-offscreen').replace(/[^0-9.]/g, '')) || getPrice(),
                    currency: getCurrency(),
                    rating: getRating(),
                    totalReviews: getReviewCount(),
                    imageUrl: document.querySelector('#landingImage')?.src ||
                        document.querySelector('.a-dynamic-image')?.src || '',
                    category: getText('#wayfinding-breadcrumbs_feature_div') || 'Unknown Category',
                    bsr: getBSR(),
                    bsrCategory: getBSRCategory(),
                    inStock: !getText('#availability').toLowerCase().includes('unavailable'),
                    seller: getText('#sellerProfileTriggerId') ||
                        getText('.tabular-buybox-text[tabular-attribute-name="Sold by"] span') ||
                        'Amazon.com',
                    brand: getText('#bylineInfo').replace(/^Brand:\s*/i, '').trim() ||
                        getText('.po-brand .po-break-word') ||
                        'Unknown Brand',
                    features: Array.from(document.querySelectorAll('#feature-bullets ul li'))
                        .map(li => li.textContent.trim())
                        .filter(text => text && !text.includes('See more product details')),
                    description: getText('#productDescription p') ||
                        getText('#feature-bullets').substring(0, 500) || ''
                };
            });

            // Add metadata
            product.asin = asin;
            product.scrapedAt = new Date().toISOString();

            console.log(`✅ Successfully scraped: ${product.title.substring(0, 50)}...`);
            console.log(`   Price: ${product.currency} ${product.price}`);
            console.log(`   Rating: ${product.rating} (${product.totalReviews} reviews)`);

            await page.close();
            return product;

        } catch (error) {
            if (page) await page.close();
            console.error(`❌ Browser scraping error for ${asin}:`, error.message);
            throw error;
        }
    }

    async scrapeReviews(asin, maxPages = 3) {
        const reviews = [];
        let page;

        try {
            await this.init();

            for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                page = await this.browser.newPage();

                await page.setUserAgent(
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
                );

                const url = `${this.baseUrl}/product-reviews/${asin}?pageNumber=${pageNum}`;

                await page.goto(url, {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });

                await this.randomDelay(1000, 2000);

                const pageReviews = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('.review')).map(review => {
                        const getText = (selector) => {
                            const el = review.querySelector(selector);
                            return el ? el.textContent.trim() : '';
                        };

                        const ratingText = getText('.review-rating');
                        const ratingMatch = ratingText.match(/(\d+\.?\d*)/);

                        return {
                            rating: ratingMatch ? parseFloat(ratingMatch[1]) : 0,
                            title: getText('.review-title'),
                            text: getText('.review-text-content span'),
                            date: getText('.review-date'),
                            verified: getText('.a-size-mini.a-color-state').includes('Verified'),
                            helpful: parseInt(getText('.cr-vote-text').match(/(\d+)/)?.[1] || '0')
                        };
                    });
                });

                reviews.push(...pageReviews);
                await page.close();

                console.log(`📊 Scraped ${pageReviews.length} reviews from page ${pageNum}`);
            }

            console.log(`✅ Total reviews scraped: ${reviews.length}`);
            return reviews;

        } catch (error) {
            if (page) await page.close();
            console.error(`❌ Error scraping reviews:`, error.message);
            return reviews;
        }
    }
}

export default BrowserScraper;

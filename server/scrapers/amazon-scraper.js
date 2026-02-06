import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';

class AmazonScraper {
    constructor() {
        this.domain = process.env.AMAZON_DOMAIN || 'amazon.com';
        this.baseUrl = `https://www.${this.domain}`;
        this.requestDelay = parseInt(process.env.REQUEST_DELAY) || 2000;
        this.maxRetries = parseInt(process.env.MAX_RETRIES) || 3;
    }

    async fetchPage(url, retries = 0) {
        try {
            const userAgent = new UserAgent();

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Cache-Control': 'max-age=0',
                    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'DNT': '1',
                    'Referer': 'https://www.google.com/',
                    'Cookie': 'session-id=147-1234567-1234567; ubid-main=134-1234567-1234567'
                },
                timeout: 20000,
                maxRedirects: 5,
                validateStatus: function (status) {
                    return status >= 200 && status < 500; // Accept 4xx responses too
                }
            });

            await this.delay(this.requestDelay);

            // Check if we got a valid response
            if (response.status === 503 || response.status === 403) {
                throw new Error(`Amazon blocked the request (HTTP ${response.status})`);
            }

            return response.data;
        } catch (error) {
            if (retries < this.maxRetries) {
                console.log(`Retry ${retries + 1}/${this.maxRetries} for ${url}`);
                await this.delay(this.requestDelay * (retries + 1));
                return this.fetchPage(url, retries + 1);
            }
            throw new Error(`Failed to fetch page after ${this.maxRetries} retries: ${error.message}`);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async scrapeProduct(asin) {
        const url = `${this.baseUrl}/dp/${asin}`;
        console.log(`Scraping product: ${asin}`);

        const html = await this.fetchPage(url);
        const $ = cheerio.load(html);

        const product = {
            asin: asin,
            title: this.extractTitle($),
            price: this.extractPrice($),
            originalPrice: this.extractOriginalPrice($),
            currency: this.extractCurrency($),
            rating: this.extractRating($),
            totalReviews: this.extractReviewCount($),
            imageUrl: this.extractImage($),
            category: this.extractCategory($),
            bsr: this.extractBSR($),
            bsrCategory: this.extractBSRCategory($),
            inStock: this.checkAvailability($),
            seller: this.extractSeller($),
            brand: this.extractBrand($),
            features: this.extractFeatures($),
            description: this.extractDescription($),
            scrapedAt: new Date().toISOString()
        };

        return product;
    }

    extractCurrency($) {
        // Try to detect currency from price symbol
        const priceSymbol = $('.a-price-symbol').first().text().trim();

        // Map common currency symbols to codes
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

        if (priceSymbol && currencyMap[priceSymbol]) {
            return currencyMap[priceSymbol];
        }

        // Detect from domain as fallback
        const domain = this.domain;
        if (domain.includes('amazon.in')) return 'INR';
        if (domain.includes('amazon.co.uk')) return 'GBP';
        if (domain.includes('amazon.de') || domain.includes('amazon.fr') ||
            domain.includes('amazon.it') || domain.includes('amazon.es')) return 'EUR';
        if (domain.includes('amazon.ca')) return 'CAD';
        if (domain.includes('amazon.com.au')) return 'AUD';
        if (domain.includes('amazon.co.jp')) return 'JPY';

        return 'USD'; // Default to USD
    }

    extractTitle($) {
        return $('#productTitle').text().trim() ||
            $('h1.product-title').text().trim() ||
            'Product Title Not Found';
    }

    extractPrice($) {
        let price = null;

        const priceWhole = $('.a-price.priceToPay .a-price-whole').first().text().trim();
        const priceFraction = $('.a-price.priceToPay .a-price-fraction').first().text().trim();

        if (priceWhole) {
            price = parseFloat(priceWhole.replace(/,/g, '') + (priceFraction || '00'));
        }

        if (!price) {
            const priceText = $('.a-price-whole').first().text().trim();
            if (priceText) {
                price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            }
        }

        return price || 0;
    }

    extractOriginalPrice($) {
        const listPrice = $('.a-price.a-text-price .a-offscreen').first().text().trim();
        if (listPrice) {
            return parseFloat(listPrice.replace(/[^0-9.]/g, ''));
        }
        return this.extractPrice($);
    }

    extractRating($) {
        const ratingText = $('span.a-icon-alt').first().text().trim();
        const match = ratingText.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    extractReviewCount($) {
        const reviewText = $('#acrCustomerReviewText').text().trim();
        const match = reviewText.match(/(\d+[\d,]*)/);
        return match ? parseInt(match[1].replace(/,/g, '')) : 0;
    }

    extractImage($) {
        return $('#landingImage').attr('src') ||
            $('#imgBlkFront').attr('src') ||
            $('.a-dynamic-image').first().attr('src') ||
            '';
    }

    extractCategory($) {
        const breadcrumbs = [];
        $('#wayfinding-breadcrumbs_feature_div ul li').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text && text !== '›') {
                breadcrumbs.push(text);
            }
        });
        return breadcrumbs.join(' > ') || 'Unknown Category';
    }

    extractBSR($) {
        const bsrText = $('#productDetails_detailBullets_sections1, #detailBulletsWrapper_feature_div')
            .text();

        const match = bsrText.match(/#([\d,]+)\s+in/);
        return match ? parseInt(match[1].replace(/,/g, '')) : null;
    }

    extractBSRCategory($) {
        const bsrText = $('#productDetails_detailBullets_sections1, #detailBulletsWrapper_feature_div')
            .text();

        const match = bsrText.match(/in\s+([^(]+)/);
        return match ? match[1].trim() : 'Unknown';
    }

    checkAvailability($) {
        const availability = $('#availability').text().toLowerCase();
        return !availability.includes('unavailable') &&
            !availability.includes('out of stock');
    }

    extractSeller($) {
        return $('#sellerProfileTriggerId').text().trim() ||
            $('.tabular-buybox-text[tabular-attribute-name="Sold by"] span').text().trim() ||
            'Amazon.com';
    }

    extractBrand($) {
        return $('#bylineInfo').text().replace(/^Brand:\s*/i, '').trim() ||
            $('.po-brand .po-break-word').text().trim() ||
            'Unknown Brand';
    }

    extractFeatures($) {
        const features = [];
        $('#feature-bullets ul li').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text && !text.includes('See more product details')) {
                features.push(text);
            }
        });
        return features;
    }

    extractDescription($) {
        return $('#productDescription p').text().trim() ||
            $('#feature-bullets').text().trim().substring(0, 500) ||
            '';
    }

    async scrapeReviews(asin, maxPages = 3) {
        const reviews = [];

        for (let page = 1; page <= maxPages; page++) {
            try {
                const url = `${this.baseUrl}/product-reviews/${asin}/ref=cm_cr_arp_d_paging_btm_next_${page}?pageNumber=${page}`;
                const html = await this.fetchPage(url);
                const $ = cheerio.load(html);

                $('.review').each((i, elem) => {
                    const $review = $(elem);

                    reviews.push({
                        rating: this.extractReviewRating($review),
                        title: $review.find('.review-title').text().trim(),
                        text: $review.find('.review-text-content span').text().trim(),
                        date: $review.find('.review-date').text().trim(),
                        verified: $review.find('.a-size-mini.a-color-state').text().includes('Verified'),
                        helpful: this.extractHelpfulCount($review)
                    });
                });

                if (page < maxPages) {
                    await this.delay(this.requestDelay);
                }
            } catch (error) {
                console.error(`Error scraping reviews page ${page}:`, error.message);
                break;
            }
        }

        return reviews;
    }

    extractReviewRating($review) {
        const ratingText = $review.find('.review-rating').text();
        const match = ratingText.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    extractHelpfulCount($review) {
        const helpfulText = $review.find('.cr-vote-text').text();
        const match = helpfulText.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
}

export default AmazonScraper;

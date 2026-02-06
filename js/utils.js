// Utility functions extracted from mock-data.js

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

// Format number with commas
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) {
        return '0';
    }
    return num.toLocaleString('en-US');
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    // Handle null/undefined/NaN values
    if (amount === null || amount === undefined || isNaN(amount)) {
        amount = 0;
    }
    // Handle different locales for better currency formatting
    const localeMap = {
        'USD': 'en-US',
        'INR': 'en-IN',
        'GBP': 'en-GB',
        'EUR': 'de-DE',
        'JPY': 'ja-JP',
        'CAD': 'en-CA',
        'AUD': 'en-AU'
    };

    const locale = localeMap[currency] || 'en-US';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'JPY' ? 0 : 2
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

// Mock data with real product examples - used as fallback when scraping fails
export const mockProducts = {
    'B08N5WRWNW': {
        asin: 'B08N5WRWNW',
        title: 'Apple AirPods Pro (2nd Generation) Wireless Ear Buds with USB-C Charging, Up to 2X More Active Noise Cancelling Bluetooth Headphones',
        price: 249.00,
        originalPrice: 279.99,
        rating: 4.6,
        totalReviews: 87432,
        imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
        category: 'Electronics > Headphones > Earbud Headphones',
        bsr: 3,
        bsrCategory: 'Electronics',
        inStock: true,
        seller: 'Amazon.com',
        brand: 'Apple',
        features: [
            'Active Noise Cancellation',
            'Transparency mode',
            'Adaptive Audio',
            'Up to 6 hours listening time with single charge',
            'USB-C charging case'
        ],
        description: 'AirPods Pro (2nd generation) deliver up to 2x more Active Noise Cancellation than the previous AirPods Pro, with Transparency mode, and now Adaptive Audio.'
    },
    'B0BSHF7WHW': {
        asin: 'B0BSHF7WHW',
        title: 'SAMSUNG Galaxy S24 Ultra Cell Phone, 256GB AI Smartphone, Unlocked Android, 200MP, 100x Zoom Cameras, Long Battery Life, S Pen',
        price: 1299.99,
        originalPrice: 1499.99,
        rating: 4.7,
        totalReviews: 23567,
        imageUrl: 'https://m.media-amazon.com/images/I/71ZOHJw+WiL._AC_SL1500_.jpg',
        category: 'Electronics > Cell Phones > Smartphones',
        bsr: 12,
        bsrCategory: 'Cell Phones & Accessories',
        inStock: true,
        seller: 'Amazon.com',
        brand: 'Samsung',
        features: [
            '200MP camera with 100x Space Zoom',
            'Built-in S Pen',
            'AI-powered features',
            '6.8-inch Dynamic AMOLED 2X display',
            '5000mAh battery'
        ],
        description: 'Galaxy S24 Ultra sets a new standard for mobile innovation with its advanced AI capabilities, titanium build, and professional-grade camera system.'
    }
};

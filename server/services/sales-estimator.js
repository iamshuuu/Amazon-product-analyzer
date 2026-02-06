class SalesEstimator {
    constructor() {
        // BSR to sales conversion multipliers by category
        this.categoryMultipliers = {
            'Electronics': 1.2,
            'Cell Phones & Accessories': 1.1,
            'Home & Kitchen': 0.9,
            'Books': 0.7,
            'Toys & Games': 1.0,
            'Sports & Outdoors': 0.8,
            'Beauty & Personal Care': 1.0,
            'Clothing, Shoes & Jewelry': 0.9,
            'Health & Household': 0.95,
            'Office Products': 0.85,
            'default': 1.0
        };
    }

    // Generate last 12 months dynamically based on current date
    generateLast12Months() {
        const months = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            months.push(`${year}-${month}`);
        }

        return months;
    }

    // Add seasonal multipliers to make data realistic
    getSeasonalMultiplier(monthString) {
        const monthNum = parseInt(monthString.split('-')[1]);

        // Seasonal patterns based on e-commerce trends
        const seasonality = {
            1: 1.15,  // January (New Year sales)
            2: 0.95,  // February (post-holiday dip)
            3: 1.0,   // March
            4: 1.0,   // April
            5: 1.05,  // May (Mother's Day)
            6: 1.1,   // June (Father's Day, summer)
            7: 1.2,   // July (Prime Day)
            8: 1.05,  // August (back to school)
            9: 0.95,  // September
            10: 1.1,  // October (Prime Day Fall)
            11: 1.35, // November (Black Friday)
            12: 1.5   // December (Holiday shopping)
        };

        return seasonality[monthNum] || 1.0;
    }

    estimateMonthlySales(bsr, category = 'default') {
        if (!bsr || bsr <= 0) {
            return 0;
        }

        // Base formula: sales decrease logarithmically with BSR
        let baseSales;

        if (bsr <= 10) {
            baseSales = 150000 - (bsr * 10000);
        } else if (bsr <= 100) {
            baseSales = 50000 - (bsr * 400);
        } else if (bsr <= 1000) {
            baseSales = 10000 - (bsr * 8);
        } else if (bsr <= 10000) {
            baseSales = 2000 - (bsr * 0.15);
        } else {
            baseSales = Math.max(100, 500 - (bsr * 0.01));
        }

        // Apply category multiplier
        const multiplier = this.categoryMultipliers[category] || this.categoryMultipliers.default;
        const estimatedSales = Math.round(baseSales * multiplier);

        return Math.max(0, estimatedSales);
    }

    generateSalesHistory(currentBSR, category, months = 12) {
        const history = [];
        const baselineSales = this.estimateMonthlySales(currentBSR, category);
        const monthNames = this.generateLast12Months();

        for (let i = 0; i < months; i++) {
            const monthString = monthNames[i];

            // Add realistic variance and seasonal patterns
            const variance = (Math.random() - 0.5) * 0.3; // ±15% variance
            const seasonalBoost = this.getSeasonalMultiplier(monthString);
            const trend = 1 + ((i - 6) * 0.02); // Slight upward trend

            const units = Math.round(baselineSales * (1 + variance) * seasonalBoost * trend);

            history.push({
                month: monthString,
                units: Math.max(0, units),
                revenue: 0 // Will be calculated with price
            });
        }

        return history;
    }

    calculateRevenue(salesHistory, price) {
        return salesHistory.map(item => ({
            ...item,
            revenue: item.units * price
        }));
    }

    generateBSRHistory(currentBSR, months = 12) {
        const history = [];
        const monthNames = this.generateLast12Months();

        for (let i = 0; i < months; i++) {
            const monthString = monthNames[i];

            // BSR fluctuates but tends toward current value
            const variance = Math.floor((Math.random() - 0.5) * currentBSR * 0.4);
            const seasonalEffect = this.getSeasonalMultiplier(monthString) > 1.2
                ? -Math.floor(currentBSR * 0.15)
                : 0;

            const rank = Math.max(1, currentBSR + variance + seasonalEffect);

            history.push({
                date: monthString + '-01',
                rank: rank
            });
        }

        return history;
    }
}

export default SalesEstimator;

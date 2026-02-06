class ReviewAnalyzer {
    constructor() {
        this.positiveWords = [
            'excellent', 'amazing', 'great', 'love', 'perfect', 'best', 'awesome',
            'fantastic', 'wonderful', 'superb', 'outstanding', 'impressive', 'quality',
            'recommend', 'satisfied', 'happy', 'good', 'nice', 'comfortable', 'easy'
        ];

        this.negativeWords = [
            'bad', 'terrible', 'awful', 'poor', 'worst', 'horrible', 'disappointing',
            'useless', 'waste', 'broken', 'defective', 'cheap', 'fail', 'problem',
            'issue', 'difficult', 'uncomfortable', 'hate', 'regret', 'returned'
        ];

        this.commonThemes = {
            positive: [
                'quality', 'value', 'price', 'shipping', 'packaging', 'design',
                'performance', 'durability', 'comfort', 'ease of use', 'features',
                'battery life', 'sound quality', 'build quality', 'customer service'
            ],
            negative: [
                'price', 'quality', 'durability', 'fit', 'size', 'delivery',
                'packaging', 'instructions', 'customer service', 'defects',
                'compatibility', 'battery life', 'noise', 'smell'
            ]
        };
    }

    analyzeReviews(reviews) {
        if (!reviews || reviews.length === 0) {
            return this.getDefaultAnalysis();
        }

        const sentimentScores = reviews.map(review => this.analyzeSentiment(review));
        const distribution = this.calculateDistribution(reviews);
        const themes = this.extractThemes(reviews);

        const positive = Math.round(
            (sentimentScores.filter(s => s > 0).length / sentimentScores.length) * 100
        );
        const negative = Math.round(
            (sentimentScores.filter(s => s < 0).length / sentimentScores.length) * 100
        );
        const neutral = 100 - positive - negative;

        return {
            distribution: distribution,
            sentiment: {
                positive: positive,
                neutral: neutral,
                negative: negative,
                themes: themes
            },
            fakeReviewRisk: this.assessFakeReviewRisk(reviews),
            fakeReviewScore: this.calculateFakeReviewScore(reviews)
        };
    }

    analyzeSentiment(review) {
        const text = (review.title + ' ' + review.text).toLowerCase();
        let score = 0;

        // Count positive words
        this.positiveWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) score += matches.length;
        });

        // Count negative words
        this.negativeWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) score -= matches.length;
        });

        // Weight by rating
        if (review.rating >= 4) score += 2;
        else if (review.rating <= 2) score -= 2;

        return score;
    }

    calculateDistribution(reviews) {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        reviews.forEach(review => {
            const rating = Math.round(review.rating);
            if (rating >= 1 && rating <= 5) {
                dist[rating]++;
            }
        });

        return dist;
    }

    extractThemes(reviews) {
        const positiveThemes = new Map();
        const negativeThemes = new Map();

        reviews.forEach(review => {
            const text = (review.title + ' ' + review.text).toLowerCase();
            const isPositive = review.rating >= 4;
            const themeList = isPositive ? this.commonThemes.positive : this.commonThemes.negative;
            const themeMap = isPositive ? positiveThemes : negativeThemes;

            themeList.forEach(theme => {
                if (text.includes(theme.toLowerCase())) {
                    themeMap.set(theme, (themeMap.get(theme) || 0) + 1);
                }
            });
        });

        // Get top themes
        const getTopThemes = (map, count = 5) => {
            return Array.from(map.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, count)
                .map(([theme]) => theme);
        };

        return {
            positive: getTopThemes(positiveThemes),
            negative: getTopThemes(negativeThemes, 4)
        };
    }

    assessFakeReviewRisk(reviews) {
        const score = this.calculateFakeReviewScore(reviews);

        if (score < 20) return 'Low';
        if (score < 50) return 'Medium';
        return 'High';
    }

    calculateFakeReviewScore(reviews) {
        let suspiciousCount = 0;
        const totalReviews = reviews.length;

        if (totalReviews === 0) return 0;

        reviews.forEach(review => {
            // Check for suspicious patterns
            const text = review.title + ' ' + review.text;

            // Very short reviews with 5 stars
            if (review.rating === 5 && text.length < 50) {
                suspiciousCount += 0.5;
            }

            // Generic praise
            if (text.toLowerCase().includes('highly recommend') && text.length < 100) {
                suspiciousCount += 0.3;
            }

            // Multiple exclamation marks
            const exclamationCount = (text.match(/!/g) || []).length;
            if (exclamationCount > 3) {
                suspiciousCount += 0.2;
            }

            // All caps
            if (text === text.toUpperCase() && text.length > 20) {
                suspiciousCount += 0.4;
            }
        });

        return Math.min(100, Math.round((suspiciousCount / totalReviews) * 100));
    }

    getDefaultAnalysis() {
        return {
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            sentiment: {
                positive: 75,
                neutral: 15,
                negative: 10,
                themes: {
                    positive: ['Quality', 'Value', 'Performance'],
                    negative: ['Price', 'Packaging']
                }
            },
            fakeReviewRisk: 'Low',
            fakeReviewScore: 15
        };
    }
}

export default ReviewAnalyzer;

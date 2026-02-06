# Amazon Product Intelligence Tool

A comprehensive web application for analyzing Amazon products with real-time data scraping, sales estimation, and competitive intelligence.

## Features

- 🔍 **Product Analysis** - Scrape and analyze any Amazon product
- 📊 **Sales Estimation** - Estimate monthly sales based on BSR rankings
- ⭐ **Review Analytics** - Sentiment analysis and theme extraction
- 💰 **Price Tracking** - Historical price data and trends
- 🎯 **Competitor Comparison** - Compare products side-by-side
- ✅ **Listing Quality Score** - Evaluate product listing optimization

## Tech Stack

**Frontend:**
- Vanilla JavaScript
- Chart.js for data visualization
- Modern CSS with glassmorphism design

**Backend:**
- Node.js + Express
- Cheerio for web scraping
- Axios for HTTP requests
- Node-Cache for response caching

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

(Linux/Mac: `cp .env.example .env`)

### 3. Start Backend Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on http://localhost:3001

### 4. Open Frontend

Open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000
```

Then navigate to http://localhost:8000

## Usage

1. **Start the backend server** (must be running on port 3001)
2. **Open the web application** in your browser
3. **Paste an Amazon product URL** or click one of the example products
4. **Click "Analyze"** to fetch and display product intelligence

### Example Products to Try

- AirPods Pro: `https://amazon.com/dp/B08N5WRWNW`
- Samsung S24 Ultra: `https://amazon.com/dp/B0BSHF7WHW`

## API Endpoints

- `GET /api/product/:asin` - Get complete product analysis
- `GET /health` - Health check endpoint

## Important Notes

⚠️ **Educational Purpose Only**

This tool is for educational purposes only. Web scraping Amazon may violate their Terms of Service. Use responsibly and consider:

- Rate limiting (2 second delay between requests)
- Respecting robots.txt
- Using official APIs for production applications
- Implementing proper authentication and authorization

## Project Structure

```
amazon-product-intelligence/
├── server.js                 # Express server
├── server/
│   ├── scrapers/
│   │   └── amazon-scraper.js # Amazon scraping logic
│   ├── services/
│   │   ├── sales-estimator.js    # BSR to sales conversion
│   │   └── review-analyzer.js    # Sentiment analysis
│   └── routes/
│       └── product-routes.js     # API endpoints
├── js/
│   ├── api-client.js        # Backend API communication
│   ├── utils.js             # Utility functions
│   ├── app.js               # Main frontend logic
│   └── about-modal.js       # About modal
├── css/
│   ├── main.css             # Main styles
│   └── components.css       # Component styles
└── index.html               # Main HTML file
```

## Features in Detail

### Sales Estimation

Uses BSR (Best Seller Rank) with category-specific multipliers to estimate monthly sales. The algorithm considers:
- BSR position
- Product category
- Seasonal trends
- Historical patterns

### Review Analysis

Extracts and analyzes:
- Rating distribution
- Sentiment (positive/neutral/negative)
- Common themes and keywords
- Fake review detection patterns

### Listing Quality

Evaluates product listings based on:
- Title optimization
- Image quality
- Feature bullet points
- Description completeness
- A+ Content presence

## Caching

The server implements response caching with a 1-hour TTL (configurable) to:
- Reduce load on Amazon's servers
- Improve response times
- Avoid rate limiting

## Future Enhancements

- [ ] Price history tracking database
- [ ] Email alerts for price changes
- [ ] Advanced competitor search
- [ ] Export reports to PDF
- [ ] User authentication
- [ ] Saved product watchlists
- [ ] API rate limiting per user
- [ ] Integration with third-party APIs (Keepa, Jungle Scout)

## License

MIT License - Educational purposes only

## Contributing

This is an educational project. Feel free to fork and modify for your learning purposes.

---

**Disclaimer:** This tool scrapes Amazon.com which may violate their Terms of Service. Use at your own risk and for educational purposes only.

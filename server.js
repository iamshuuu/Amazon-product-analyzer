import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import productRoutes from './server/routes/product-routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 3600 });

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static('.'));

// Cache middleware
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log(`Cache HIT: ${key}`);
        return res.json(cachedResponse);
    }

    // Store original json function
    const originalJson = res.json;

    // Override json function to cache response
    res.json = function (data) {
        cache.set(key, data);
        console.log(`Cache SET: ${key}`);
        return originalJson.call(this, data);
    };

    next();
});

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', productRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        cache: {
            keys: cache.keys().length,
            stats: cache.getStats()
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Amazon Product Intelligence API',
        version: '1.0.0',
        endpoints: {
            product: '/api/product/:asin',
            health: '/health'
        },
        usage: {
            example: `/api/product/B08N5WRWNW`
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║  Amazon Product Intelligence API Server              ║
║                                                       ║
║  Server running on: http://localhost:${PORT}          ║
║  Environment: ${process.env.NODE_ENV || 'development'}                       ║
║  Cache TTL: ${process.env.CACHE_TTL || 3600}s                              ║
║                                                       ║
║  Endpoints:                                          ║
║  - GET /api/product/:asin                           ║
║  - GET /health                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;

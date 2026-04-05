const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rootRouter = require('./routes');
const { connectDB } = require('./entities');

const app = express();

// Disable TLS verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless DB Connection Middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("DB Connection Failure:", error);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

// Health Check Route
app.get('/api/ping', (req, res) => res.status(200).json({ status: 'ok', server: 'vercel' }));

// Setup API Routes
app.use('/api', rootRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("--- GLOBAL ERROR ---");
    console.error(err);
    res.status(500).json({ 
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

module.exports = app;

// Start Server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

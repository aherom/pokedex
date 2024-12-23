const express = require('express');
const path = require('path');
const redis = require('redis');
const pokemonRoutes = require('./routes/pokemonRoutes');

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Redis client setup
const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',  // Use Redis service name if using Docker
        port: process.env.REDIS_PORT || 6379,
    },
});

// Redis connection error handling
client.on('error', (err) => {
    console.error('Redis error:', err);
});

// Ensure the client connects before starting the server
client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
});

// Pass Redis client to routes
app.use((req, res, next) => {
    req.redisClient = client;
    next();
});

// Routes
app.use('/pokemon', pokemonRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

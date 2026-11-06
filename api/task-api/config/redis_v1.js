import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    RESP: 2,
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err.message);
});

redisClient.on('connect', () => {
    console.log('Redis In-Memory Cache Connected');
});

// Connect to Redis on startup
await redisClient.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err.message);
});

export default redisClient;
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
    url: redisUrl || 'redis://127.0.0.1:6379',
    disableOfflineQueue: true, // Prevents requests from hanging indefinitely when Redis is disconnected
    RESP: 2,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.warn('Redis reconnection attempts exhausted. Operating with direct database fallback.');
                return false;
            }
            return Math.min(retries * 500, 2000);
        },
    },
});

redisClient.on('error', (err) => {
    console.warn('Redis Client Warning:', err.message);
});

redisClient.on('connect', () => {
    console.log('Redis In-Memory Cache Connected');
});

redisClient.on('ready', () => {
    console.log('Redis In-Memory Cache Ready');
});

// Connect to Redis on startup; if it fails, app continues smoothly using MongoDB
redisClient.connect().catch((err) => {
    console.warn(`Redis Cache Notice: ${err.message}. Tasks and dashboard will operate normally using MongoDB.`);
});

export default redisClient;

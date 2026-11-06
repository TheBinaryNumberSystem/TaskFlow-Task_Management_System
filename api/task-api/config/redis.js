import { createClient } from 'redis';

let redisClient = null;

try {
    let rawUrl = process.env.REDIS_URL;
    if (rawUrl) {
        rawUrl = rawUrl.trim().replace(/^["']|["']$/g, '');
        // If user accidentally copied Upstash REST URL (https://), notify and avoid crash
        if (rawUrl.startsWith('https://') || rawUrl.startsWith('http://')) {
            console.warn('REDIS_URL was set to an HTTP/HTTPS REST endpoint. Node Redis requires rediss://. Falling back to direct MongoDB.');
            rawUrl = null;
        }
    }

    const redisUrl = rawUrl || (process.env.NODE_ENV !== 'production' ? 'redis://127.0.0.1:6379' : null);

    if (redisUrl) {
        redisClient = createClient({
            url: redisUrl,
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
    } else {
        console.log('No valid REDIS_URL provided. Operating directly with MongoDB.');
    }
} catch (err) {
    console.warn('Failed to initialize Redis client safely:', err.message);
    redisClient = null;
}

export default redisClient;

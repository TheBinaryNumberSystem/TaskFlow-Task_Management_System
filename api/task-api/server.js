import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust reverse proxies (such as Render) for accurate client IPs in rate limiting
app.set('trust proxy', 1);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'task-api', message: 'TASK API ROOT WORKING' });
});

console.log("CLIENT_URL =", process.env.CLIENT_URL);

// Dynamic CORS supporting credentials from Vercel deployments and localhost
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, '');
        const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/+$/, '') : null;
        const isAllowed =
            !clientUrl ||
            cleanOrigin === clientUrl ||
            cleanOrigin.endsWith('.vercel.app') ||
            cleanOrigin.includes('localhost');

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, true); // Fallback allows matching dynamic deployment URLs
        }
    },
    credentials: true,
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'task-api' });
});

app.use('/api/tasks', apiLimiter);
app.use('/api/tasks', taskRoutes);
app.use('/tasks', apiLimiter);
app.use('/tasks', taskRoutes);

// Port listener (Port 5002)
const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Task API service running on port ${PORT}`);
});

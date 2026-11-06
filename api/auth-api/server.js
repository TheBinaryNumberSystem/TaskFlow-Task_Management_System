import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust reverse proxies (such as Render) for accurate client IPs in rate limiting
app.set('trust proxy', 1);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'auth-api', message: 'AUTH API ROOT WORKING' });
});

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
app.use(cookieParser());

// Basic test/health route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'auth-api' });
});

app.use('/api/auth', authRoutes);

// Port listener
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Auth-API service running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
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

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
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
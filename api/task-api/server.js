import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
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

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'task-api' });
});

app.use('/api/tasks', taskRoutes);

// Port listener (Port 5002)
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Task API service running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

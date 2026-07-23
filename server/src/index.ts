import userRoutes from './routes/userRoutes';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import requestRoutes from './routes/requestRoutes';
import aiRoutes from './routes/aiRoutes';
import adminRoutes from './routes/adminRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3002",
     "https://service-request-management-system-c-nine.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes); 

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Service is healthy',
  });
});

app.get('/api/health/ai', (req, res) => {
  res.status(200).json({
    status: 'OK',
    provider: process.env.AI_PROVIDER || 'mock',
  });
});

// 404 Handler
app.use((req, res) => {
  return res.status(404).json({
    error: 'Endpoint not found',
  });
});

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});
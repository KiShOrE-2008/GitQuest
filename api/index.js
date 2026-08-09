import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from '../server/routes/auth.js';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mount auth routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Connect to MongoDB (cached for serverless warm starts)
let cachedConnection = null;
async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set — running without database.');
    return;
  }
  cachedConnection = await mongoose.connect(uri);
}

// Serverless handler
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}

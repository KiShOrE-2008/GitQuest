import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gitverse';

// Express Middlewares
app.use(cors());
app.use(express.json());

// Routes Mounting
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

// Establish MongoDB connection
console.log('Connecting to MongoDB database at:', MONGODB_URI.substring(0, 30) + '...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Successfully connected to MongoDB Database Atlas.');
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`✓ GitVerse Server is listening on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('✗ MongoDB Connection Error:', err.message);
    console.warn('⚠️ Server booting in OFFLINE mode. MONGODB_URI must be configured for cloud persistence.');
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`✓ GitVerse Server is listening on port ${PORT} (Offline Database Fallback)`);
      });
    }
  });

export default app;

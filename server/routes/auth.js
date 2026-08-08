import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gitverse_dev_secret_key_987';

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, collegeName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required credentials fields' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({ 
        error: 'Password must include at least one uppercase letter, lowercase letter, number, and special character' 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      collegeName: collegeName ? collegeName.trim() : ''
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        collegeName: user.collegeName,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        completedChapters: user.completedChapters,
        achievements: user.achievements,
        activeWorld: user.activeWorld,
        provider: user.provider
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during signup: ' + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        collegeName: user.collegeName,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        completedChapters: user.completedChapters,
        achievements: user.achievements,
        activeWorld: user.activeWorld,
        provider: user.provider
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login: ' + err.message });
  }
});

// Sync Progress
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const { xp, level, streak, completedChapters, achievements, activeWorld, collegeName } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user profile properties
    if (xp !== undefined) user.xp = xp;
    if (level !== undefined) user.level = level;
    if (streak !== undefined) user.streak = streak;
    if (completedChapters !== undefined) user.completedChapters = completedChapters;
    if (achievements !== undefined) user.achievements = achievements;
    if (activeWorld !== undefined) user.activeWorld = activeWorld;
    if (collegeName !== undefined) user.collegeName = collegeName.trim();

    await user.save();

    res.json({
      message: 'Progress synchronized successfully',
      user: {
        username: user.username,
        email: user.email,
        collegeName: user.collegeName,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        completedChapters: user.completedChapters,
        achievements: user.achievements,
        activeWorld: user.activeWorld,
        provider: user.provider
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during sync: ' + err.message });
  }
});

export default router;

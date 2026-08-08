import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    trim: true,
    default: ''
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 1
  },
  completedChapters: {
    type: [Number],
    default: []
  },
  achievements: {
    type: [String],
    default: []
  },
  activeWorld: {
    type: String,
    enum: ['kingdom', 'space'],
    default: 'kingdom'
  },
  provider: {
    type: String,
    default: 'credentials'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;

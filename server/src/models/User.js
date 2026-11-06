const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  targetExam: { type: String, default: 'General Aptitude' },
  streak: { type: Number, default: 1 },
  lastActiveDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  savedFormulas: [{ type: String }], // formula ids or names
  completedTopics: [{ type: String }], // topic slugs
  stats: {
    testsAttempted: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalTimeSpentSec: { type: Number, default: 0 },
  },
  resetOtp: { type: String, default: null },
  resetOtpExpire: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

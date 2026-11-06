const mongoose = require('mongoose');

const dailyQuestionSchema = new mongoose.Schema({
  id: String,
  section: { type: String, enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'], required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

const dailyChallengeSchema = new mongoose.Schema({
  dateString: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  title: { type: String, default: 'Daily Aptitude Sprint' },
  questions: [dailyQuestionSchema],
  totalQuestions: { type: Number, default: 15 },
  durationMinutes: { type: Number, default: 20 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);

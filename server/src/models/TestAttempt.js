const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String },
  userName: { type: String },
  mockTest: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest' },
  testTitle: { type: String, required: true },
  category: { type: String },
  score: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  accuracy: { type: Number, required: true }, // in %
  totalQuestions: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  incorrectCount: { type: Number, required: true },
  unattemptedCount: { type: Number, required: true },
  timeSpentSeconds: { type: Number, required: true },
  
  sectionWise: [{
    section: String,
    score: Number,
    total: Number,
    correct: Number,
    incorrect: Number,
    accuracy: Number
  }],

  answers: [{
    questionId: String,
    section: String,
    questionText: String,
    selectedOption: Number, // -1 if not attempted
    correctAnswer: Number,
    isCorrect: Boolean,
    explanation: String
  }],

  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestAttempt', testAttemptSchema);

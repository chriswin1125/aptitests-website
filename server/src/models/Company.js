const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  tagline: { type: String },
  hiringRoles: [String],
  ctcRange: { type: String, default: '3.6 LPA - 9.0 LPA' },
  overview: { type: String, required: true },
  assessmentPattern: {
    totalDurationMinutes: Number,
    totalQuestions: Number,
    sections: [{
      name: String,
      questions: Number,
      durationMinutes: Number,
      difficulty: String,
      topics: [String]
    }]
  },
  rounds: [{
    roundNumber: Number,
    roundName: String,
    description: String,
    mode: String,
    keyFocus: [String]
  }],
  practiceQuestions: [{
    section: String,
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    yearAsked: String
  }],
  interviewTips: [{
    category: String,
    points: [String]
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);

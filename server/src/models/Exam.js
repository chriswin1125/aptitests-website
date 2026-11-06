const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Banking Exams', 'Competitive Exams', 'Campus Placement'] 
  },
  tagline: { type: String },
  frequency: { type: String, default: 'Annually' },
  eligibility: { type: String },
  totalMarks: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  negativeMarking: { type: String, default: '0.25 marks deducted per wrong answer' },
  overview: { type: String, required: true },
  
  stages: [{
    stageName: String,
    mode: String,
    duration: String,
    totalQuestions: Number,
    totalMarks: Number,
    sections: [{
      name: String,
      questions: Number,
      marks: Number,
      timeLimit: String,
      syllabus: [String]
    }]
  }],

  preparationStrategy: [{
    phase: String,
    title: String,
    description: String,
    tips: [String]
  }],

  sampleQuestions: [{
    question: String,
    section: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],

  recommendedTopics: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema);

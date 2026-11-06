const mongoose = require('mongoose');

const solvedExampleSchema = new mongoose.Schema({
  title: String,
  question: { type: String, required: true },
  solution: { type: String, required: true },
  explanation: String,
  shortcut: String,
  finalAnswer: String
}, { _id: false });

const practiceQuestionSchema = new mongoose.Schema({
  id: String,
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index 0-3
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Previous Exams'], default: 'Intermediate' },
  previousExamRef: String,
  explanation: String,
  shortcutTip: String
}, { _id: false });

const topicTestQuestionSchema = new mongoose.Schema({
  id: String,
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index 0-3
  explanation: String,
  marks: { type: Number, default: 1 }
}, { _id: false });

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Quantitative Aptitude', 
      'Logical Reasoning', 
      'Verbal Ability', 
      'Data Interpretation', 
      'Computer Aptitude'
    ] 
  },
  icon: { type: String, default: 'Calculator' },
  badge: { type: String, default: 'Popular' },
  importance: { type: String, default: 'High' },
  examUsage: { type: String, default: 'Asked in all major Banking (IBPS, SBI), SSC, CAT, & Campus Placements' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  estimatedTime: { type: String, default: '3.5 Hours' },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  
  concepts: {
    basic: [{ title: String, content: String }],
    intermediate: [{ title: String, content: String }],
    advanced: [{ title: String, content: String }],
    shortcuts: [{ title: String, trick: String, example: String }],
    commonMistakes: [{ mistake: String, correction: String }]
  },

  formulas: [{
    name: String,
    expression: String,
    explanation: String,
    variables: [{ symbol: String, meaning: String }],
    whenToUse: String,
    solvedExample: String
  }],

  solvedExamples: [solvedExampleSchema],
  practiceQuestions: [practiceQuestionSchema],
  testQuestions: [topicTestQuestionSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', topicSchema);

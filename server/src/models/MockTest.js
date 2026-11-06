const mongoose = require('mongoose');

const mockTestQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  section: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true },
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0.25 }
}, { _id: false });

const mockTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Banking', 'Competitive', 'Campus Placement', 'Topic Special'] 
  },
  examSlug: { type: String },
  examName: { type: String },
  type: { 
    type: String, 
    enum: ['Full Mock', 'Sectional Test', 'Topic Mastery', 'Company Specific'], 
    default: 'Full Mock' 
  },
  durationMinutes: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard', 'Exam Level'], default: 'Exam Level' },
  instructions: [{ type: String }],
  questions: [mockTestQuestionSchema],
  attemptsCount: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockTest', mockTestSchema);

const mongoose = require('mongoose');

const formulaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topicSlug: { type: String, required: true },
  topicName: { type: String, required: true },
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
  expression: { type: String, required: true },
  variables: [{
    symbol: String,
    meaning: String
  }],
  whenToUse: { type: String, required: true },
  solvedExample: {
    question: { type: String, required: true },
    solution: { type: String, required: true },
    answer: { type: String, required: true }
  },
  tags: [{ type: String }],
  isImportant: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Formula', formulaSchema);

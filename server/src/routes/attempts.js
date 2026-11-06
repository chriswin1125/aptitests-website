const express = require('express');
const router = express.Router();
const TestAttempt = require('../models/TestAttempt');
const { auth } = require('../middleware/auth');

// Get current user's test history
router.get('/my', auth, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id })
      .select('testTitle category score maxMarks accuracy totalQuestions correctCount incorrectCount unattemptedCount timeSpentSeconds completedAt')
      .sort({ completedAt: -1 });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching test history', error: err.message });
  }
});

// Get single attempt details (with detailed question answers)
router.get('/:id', auth, async (req, res) => {
  try {
    const attempt = await TestAttempt.findById(req.params.id);
    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
    
    // Only author or admin can view
    if (attempt.user && attempt.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attempt details', error: err.message });
  }
});

module.exports = router;

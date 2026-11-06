const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Topic = require('../models/Topic');
const Formula = require('../models/Formula');
const Exam = require('../models/Exam');
const Company = require('../models/Company');
const MockTest = require('../models/MockTest');
const TestAttempt = require('../models/TestAttempt');
const { auth, requireAdmin } = require('../middleware/auth');

// Platform Statistics
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalTopics,
      totalFormulas,
      totalExams,
      totalCompanies,
      totalMockTests,
      totalAttempts
    ] = await Promise.all([
      User.countDocuments(),
      Topic.countDocuments(),
      Formula.countDocuments(),
      Exam.countDocuments(),
      Company.countDocuments(),
      MockTest.countDocuments(),
      TestAttempt.countDocuments()
    ]);

    const recentUsers = await User.find().select('name email role targetExam streak createdAt').sort({ createdAt: -1 }).limit(8);
    const recentAttempts = await TestAttempt.find().select('userEmail testTitle score maxMarks accuracy completedAt').sort({ completedAt: -1 }).limit(8);

    res.json({
      counts: {
        totalUsers,
        totalTopics,
        totalFormulas,
        totalExams,
        totalCompanies,
        totalMockTests,
        totalAttempts
      },
      recentUsers,
      recentAttempts
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading admin stats', error: err.message });
  }
});

// Manage Users
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error loading users', error: err.message });
  }
});

// Toggle user role
router.put('/users/:id/role', auth, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user role', error: err.message });
  }
});

module.exports = router;

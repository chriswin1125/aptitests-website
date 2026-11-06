const express = require('express');
const router = express.Router();
const MockTest = require('../models/MockTest');
const TestAttempt = require('../models/TestAttempt');
const User = require('../models/User');
const { auth, requireAdmin, optionalAuth } = require('../middleware/auth');

// Get all mock tests with category and type filter
router.get('/', async (req, res) => {
  try {
    const { category, type, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (type && type !== 'All') {
      filter.type = type;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { examName: { $regex: search, $options: 'i' } }
      ];
    }

    const tests = await MockTest.find(filter)
      .select('title slug category examSlug examName type durationMinutes totalQuestions totalMarks difficulty attemptsCount averageScore')
      .sort({ createdAt: -1 });

    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching mock tests', error: err.message });
  }
});

// Get single mock test for taking exam (optionally randomizing order)
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const test = await MockTest.findOne({ slug: req.params.slug });
    if (!test) return res.status(404).json({ message: 'Mock test not found' });

    // When starting test, don't expose correctAnswer to client if not submitted!
    // But preserve id so responses can be mapped.
    const sanitizedQuestions = test.questions.map((q, idx) => ({
      id: q.id || `q_${idx}`,
      section: q.section,
      question: q.question,
      options: q.options,
      marks: q.marks,
      negativeMarks: q.negativeMarks
    }));

    res.json({
      _id: test._id,
      title: test.title,
      slug: test.slug,
      category: test.category,
      examSlug: test.examSlug,
      examName: test.examName,
      type: test.type,
      durationMinutes: test.durationMinutes,
      totalQuestions: test.totalQuestions,
      totalMarks: test.totalMarks,
      difficulty: test.difficulty,
      instructions: test.instructions,
      questions: sanitizedQuestions
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching test', error: err.message });
  }
});

// Submit mock test
router.post('/:slug/submit', optionalAuth, async (req, res) => {
  try {
    const test = await MockTest.findOne({ slug: req.params.slug });
    if (!test) return res.status(404).json({ message: 'Mock test not found' });

    const { userAnswers, timeSpentSeconds } = req.body; // userAnswers: { [questionId]: selectedOptionIndex }

    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    const sectionStats = {};

    const evaluatedAnswers = test.questions.map((q, idx) => {
      const qId = q.id || `q_${idx}`;
      const selected = userAnswers ? userAnswers[qId] : undefined;
      const attempted = selected !== undefined && selected !== null && selected !== -1;
      const isCorrect = attempted && Number(selected) === q.correctAnswer;

      if (!sectionStats[q.section]) {
        sectionStats[q.section] = {
          section: q.section,
          score: 0,
          total: 0,
          correct: 0,
          incorrect: 0
        };
      }
      sectionStats[q.section].total += 1;

      if (!attempted) {
        unattemptedCount += 1;
      } else if (isCorrect) {
        correctCount += 1;
        totalScore += (q.marks || 1);
        sectionStats[q.section].correct += 1;
        sectionStats[q.section].score += (q.marks || 1);
      } else {
        incorrectCount += 1;
        const deduction = (q.negativeMarks !== undefined ? q.negativeMarks : 0.25);
        totalScore -= deduction;
        sectionStats[q.section].incorrect += 1;
        sectionStats[q.section].score -= deduction;
      }

      return {
        questionId: qId,
        section: q.section,
        questionText: q.question,
        options: q.options,
        selectedOption: attempted ? Number(selected) : -1,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        marksAwarded: attempted ? (isCorrect ? (q.marks || 1) : - (q.negativeMarks || 0.25)) : 0
      };
    });

    // Normalize final score to 2 decimal places, minimum 0
    totalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    const attemptedQuestions = correctCount + incorrectCount;
    const accuracy = attemptedQuestions > 0 ? Math.round((correctCount / attemptedQuestions) * 100) : 0;

    const sectionWise = Object.values(sectionStats).map(s => ({
      section: s.section,
      score: Math.max(0, Math.round(s.score * 100) / 100),
      total: s.total,
      correct: s.correct,
      incorrect: s.incorrect,
      accuracy: (s.correct + s.incorrect > 0) ? Math.round((s.correct / (s.correct + s.incorrect)) * 100) : 0
    }));

    // Save test attempt
    const attemptData = {
      mockTest: test._id,
      testTitle: test.title,
      category: test.category,
      score: totalScore,
      maxMarks: test.totalMarks,
      accuracy,
      totalQuestions: test.totalQuestions,
      correctCount,
      incorrectCount,
      unattemptedCount,
      timeSpentSeconds: timeSpentSeconds || 0,
      sectionWise,
      answers: evaluatedAnswers
    };

    if (req.user) {
      attemptData.user = req.user._id;
      attemptData.userEmail = req.user.email;
      attemptData.userName = req.user.name;

      // Update user stats
      await User.findByIdAndUpdate(req.user._id, {
        $inc: {
          'stats.testsAttempted': 1,
          'stats.totalScore': totalScore,
          'stats.totalQuestions': test.totalQuestions,
          'stats.correctAnswers': correctCount,
          'stats.totalTimeSpentSec': timeSpentSeconds || 0
        }
      });
    }

    const savedAttempt = await TestAttempt.create(attemptData);

    // Update test stats
    await MockTest.findByIdAndUpdate(test._id, {
      $inc: { attemptsCount: 1 }
    });

    res.json({
      attemptId: savedAttempt._id,
      testTitle: test.title,
      category: test.category,
      score: totalScore,
      maxMarks: test.totalMarks,
      accuracy,
      totalQuestions: test.totalQuestions,
      correctCount,
      incorrectCount,
      unattemptedCount,
      timeSpentSeconds: timeSpentSeconds || 0,
      sectionWise,
      answers: evaluatedAnswers
    });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting test', error: err.message });
  }
});

// Admin: Create test
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const test = await MockTest.create(req.body);
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: 'Error creating test', error: err.message });
  }
});

// Admin: Update test
router.put('/:slug', auth, requireAdmin, async (req, res) => {
  try {
    const test = await MockTest.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: 'Error updating test', error: err.message });
  }
});

// Admin: Delete test
router.delete('/:slug', auth, requireAdmin, async (req, res) => {
  try {
    await MockTest.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting test', error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const DailyChallenge = require('../models/DailyChallenge');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

// Get today's challenge
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let challenge = await DailyChallenge.findOne({ dateString: today });

    // Fallback: if today's challenge not generated yet, find the most recent one
    if (!challenge) {
      challenge = await DailyChallenge.findOne().sort({ dateString: -1 });
    }

    if (!challenge) {
      return res.status(404).json({ message: 'No daily challenge available yet' });
    }

    // Sanitize question options so client cannot peek at answers before submitting
    const sanitized = challenge.questions.map((q, idx) => ({
      id: q.id || `dq_${idx}`,
      section: q.section,
      question: q.question,
      options: q.options
    }));

    res.json({
      dateString: challenge.dateString,
      title: challenge.title,
      totalQuestions: challenge.totalQuestions,
      durationMinutes: challenge.durationMinutes,
      questions: sanitized
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching daily challenge', error: err.message });
  }
});

// Submit daily challenge
router.post('/submit', optionalAuth, async (req, res) => {
  try {
    const { dateString, answers, timeSpentSeconds } = req.body;
    let challenge = await DailyChallenge.findOne({ dateString });
    if (!challenge) {
      challenge = await DailyChallenge.findOne().sort({ dateString: -1 });
    }
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    const sectionBreakdown = {
      'Quantitative Aptitude': { correct: 0, total: 0 },
      'Logical Reasoning': { correct: 0, total: 0 },
      'Verbal Ability': { correct: 0, total: 0 }
    };

    const evaluated = challenge.questions.map((q, idx) => {
      const qId = q.id || `dq_${idx}`;
      const selected = answers ? answers[qId] : undefined;
      const attempted = selected !== undefined && selected !== null && selected !== -1;
      const isCorrect = attempted && Number(selected) === q.correctAnswer;

      if (!sectionBreakdown[q.section]) {
        sectionBreakdown[q.section] = { correct: 0, total: 0 };
      }
      sectionBreakdown[q.section].total += 1;

      if (!attempted) {
        unattemptedCount += 1;
      } else if (isCorrect) {
        correctCount += 1;
        sectionBreakdown[q.section].correct += 1;
      } else {
        incorrectCount += 1;
      }

      return {
        id: qId,
        section: q.section,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedOption: attempted ? Number(selected) : -1,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = challenge.questions.length;
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const score = correctCount;

    let updatedStreak = 1;
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (user.lastActiveDate === yesterday) {
          user.streak = (user.streak || 0) + 1;
        } else if (user.lastActiveDate !== today) {
          user.streak = 1;
        }
        user.lastActiveDate = today;

        user.stats.testsAttempted += 1;
        user.stats.totalScore += score;
        user.stats.totalQuestions += totalQuestions;
        user.stats.correctAnswers += correctCount;
        user.stats.totalTimeSpentSec += (timeSpentSeconds || 60);

        await user.save();
        updatedStreak = user.streak;
      }
    }

    res.json({
      dateString: challenge.dateString,
      score,
      totalQuestions,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      streak: updatedStreak,
      timeSpentSeconds: timeSpentSeconds || 0,
      sectionBreakdown,
      questions: evaluated
    });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting daily challenge', error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const { auth, requireAdmin, optionalAuth } = require('../middleware/auth');
const User = require('../models/User');

// Get all topics with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, difficulty } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { examUsage: { $regex: search, $options: 'i' } }
      ];
    }

    const topics = await Topic.find(filter)
      .select('name slug category icon badge importance examUsage difficulty estimatedTime summary')
      .sort({ category: 1, name: 1 });

    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching topics', error: err.message });
  }
});

// Get single topic details by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    let isCompleted = false;
    if (req.user && req.user.completedTopics) {
      isCompleted = req.user.completedTopics.includes(topic.slug);
    }

    res.json({ topic, isCompleted });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching topic details', error: err.message });
  }
});

// Submit Topic Mini-Test
router.post('/:slug/submit-test', optionalAuth, async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const { answers, timeSpentSeconds } = req.body; // { questionIndex: selectedOption }
    const questions = topic.testQuestions;

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const evaluatedQuestions = questions.map((q, idx) => {
      const selected = answers ? answers[idx] : undefined;
      const attempted = selected !== undefined && selected !== null && selected !== -1;
      const isCorrect = attempted && Number(selected) === q.correctAnswer;

      if (!attempted) unattemptedCount++;
      else if (isCorrect) correctCount++;
      else incorrectCount++;

      return {
        id: q.id || `q_${idx}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedOption: attempted ? Number(selected) : -1,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = questions.length;
    const score = correctCount;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / (correctCount + incorrectCount || 1)) * 100) : 0;
    const masteryLevel = accuracy >= 80 ? 'Mastered' : accuracy >= 50 ? 'Proficient' : 'Learning';

    // Update user stats if logged in
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.stats.testsAttempted += 1;
        user.stats.totalScore += score;
        user.stats.totalQuestions += totalQuestions;
        user.stats.correctAnswers += correctCount;
        user.stats.totalTimeSpentSec += (timeSpentSeconds || 60);

        if (masterlyLevelThreshold(accuracy) && !user.completedTopics.includes(topic.slug)) {
          user.completedTopics.push(topic.slug);
        }
        await user.save();
      }
    }

    res.json({
      score,
      totalQuestions,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      masteryLevel,
      timeSpentSeconds: timeSpentSeconds || 0,
      questions: evaluatedQuestions
    });
  } catch (err) {
    res.status(500).json({ message: 'Error evaluating test', error: err.message });
  }
});

function masterlyLevelThreshold(acc) {
  return acc >= 70;
}

// Create topic (Admin)
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ message: 'Error creating topic', error: err.message });
  }
});

// Update topic (Admin)
router.put('/:slug', auth, requireAdmin, async (req, res) => {
  try {
    const topic = await Topic.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: 'Error updating topic', error: err.message });
  }
});

// Delete topic (Admin)
router.delete('/:slug', auth, requireAdmin, async (req, res) => {
  try {
    await Topic.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: 'Topic deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting topic', error: err.message });
  }
});

module.exports = router;

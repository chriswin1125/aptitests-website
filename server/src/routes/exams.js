const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { auth, requireAdmin } = require('../middleware/auth');

// Get all exams with category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    const exams = await Exam.find(filter).sort({ category: 1, name: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching exams', error: err.message });
  }
});

// Get single exam by slug
router.get('/:slug', async (req, res) => {
  try {
    const exam = await Exam.findOne({ slug: req.params.slug });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching exam', error: err.message });
  }
});

// Admin: Add exam
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Error creating exam', error: err.message });
  }
});

// Admin: Update exam
router.put('/:slug', auth, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Error updating exam', error: err.message });
  }
});

module.exports = router;

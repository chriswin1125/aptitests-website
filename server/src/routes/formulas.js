const express = require('express');
const router = express.Router();
const Formula = require('../models/Formula');
const { auth, requireAdmin, optionalAuth } = require('../middleware/auth');

// Get all formulas with search and filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, topic, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (topic && topic !== 'All') {
      filter.topicSlug = topic;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { expression: { $regex: search, $options: 'i' } },
        { topicName: { $regex: search, $options: 'i' } },
        { whenToUse: { $regex: search, $options: 'i' } }
      ];
    }

    const formulas = await Formula.find(filter).sort({ category: 1, topicName: 1 });
    
    let savedFormulaIds = [];
    if (req.user && req.user.savedFormulas) {
      savedFormulaIds = req.user.savedFormulas;
    }

    const enhancedFormulas = formulas.map(f => ({
      ...f.toObject(),
      isBookmarked: savedFormulaIds.includes(f._id.toString())
    }));

    res.json(enhancedFormulas);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching formulas', error: err.message });
  }
});

// Get distinct topics that have formulas
router.get('/topics', async (req, res) => {
  try {
    const topics = await Formula.aggregate([
      { $group: { _id: { slug: '$topicSlug', name: '$topicName', category: '$category' }, count: { $sum: 1 } } },
      { $sort: { '_id.category': 1, '_id.name': 1 } }
    ]);
    res.json(topics.map(t => ({ slug: t._id.slug, name: t._id.name, category: t._id.category, count: t.count })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching formula topics', error: err.message });
  }
});

// Admin: Add formula
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const formula = await Formula.create(req.body);
    res.status(201).json(formula);
  } catch (err) {
    res.status(500).json({ message: 'Error creating formula', error: err.message });
  }
});

// Admin: Edit formula
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const formula = await Formula.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!formula) return res.status(404).json({ message: 'Formula not found' });
    res.json(formula);
  } catch (err) {
    res.status(500).json({ message: 'Error updating formula', error: err.message });
  }
});

// Admin: Delete formula
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await Formula.findByIdAndDelete(req.params.id);
    res.json({ message: 'Formula deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting formula', error: err.message });
  }
});

module.exports = router;

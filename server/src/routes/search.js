const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Formula = require('../models/Formula');
const Exam = require('../models/Exam');
const Company = require('../models/Company');
const MockTest = require('../models/MockTest');

// Global search
router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ topics: [], formulas: [], exams: [], companies: [], tests: [] });
    }

    const regex = new RegExp(q.trim(), 'i');

    const topicFilter = {
      $or: [{ name: regex }, { summary: regex }, { examUsage: regex }]
    };
    if (category && category !== 'All') topicFilter.category = category;

    const formulaFilter = {
      $or: [{ name: regex }, { expression: regex }, { topicName: regex }, { whenToUse: regex }]
    };
    if (category && category !== 'All') formulaFilter.category = category;

    const [topics, formulas, exams, companies, tests] = await Promise.all([
      Topic.find(topicFilter).select('name slug category difficulty summary icon').limit(6),
      Formula.find(formulaFilter).select('name expression topicSlug topicName category whenToUse').limit(6),
      Exam.find({ $or: [{ name: regex }, { category: regex }, { overview: regex }] }).select('name slug category tagline totalMarks durationMinutes').limit(6),
      Company.find({ $or: [{ name: regex }, { overview: regex }, { ctcRange: regex }] }).select('name slug tagline ctcRange').limit(6),
      MockTest.find({ $or: [{ title: regex }, { category: regex }, { examName: regex }] }).select('title slug category type durationMinutes totalQuestions difficulty').limit(6)
    ]);

    res.json({
      query: q,
      results: {
        topics,
        formulas,
        exams,
        companies,
        tests
      },
      totalMatches: topics.length + formulas.length + exams.length + companies.length + tests.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Error performing search', error: err.message });
  }
});

module.exports = router;

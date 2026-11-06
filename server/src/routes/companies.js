const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { auth, requireAdmin } = require('../middleware/auth');

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching companies', error: err.message });
  }
});

// Get single company by slug
router.get('/:slug', async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching company', error: err.message });
  }
});

// Admin: Add company
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: 'Error creating company', error: err.message });
  }
});

// Admin: Update company
router.put('/:slug', auth, requireAdmin, async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Error updating company', error: err.message });
  }
});

module.exports = router;

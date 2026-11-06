require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://chris123:chriswin123@cluster0.kvgihmd.mongodb.net/aptitude_pro?retryWrites=true&w=majority';

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB Atlas connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/formulas', require('./routes/formulas'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/mocktests', require('./routes/mocktests'));
app.use('/api/attempts', require('./routes/attempts'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/search', require('./routes/search'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Aptitude Pro',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Aptitude Pro Server is running on http://localhost:${PORT}`);
});

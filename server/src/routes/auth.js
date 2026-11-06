const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'aptitude_pro_jwt_secret_token_secure_key_2026', {
    expiresIn: '30d'
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, targetExam } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      targetExam: targetExam || 'General Aptitude',
      role: 'user'
    });

    const token = signToken(user._id);
    const userSafe = user.toObject();
    delete userSafe.password;

    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user.', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Update streak if active today
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate === yesterday) {
        user.streak = (user.streak || 0) + 1;
      } else {
        user.streak = 1;
      }
      user.lastActiveDate = today;
      await user.save();
    }

    const token = signToken(user._id);
    const userSafe = user.toObject();
    delete userSafe.password;

    res.json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in.', error: err.message });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, targetExam, avatar, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (targetExam) user.targetExam = targetExam;
    if (avatar !== undefined) user.avatar = avatar;
    if (newPassword && newPassword.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    const userSafe = user.toObject();
    delete userSafe.password;
    res.json({ user: userSafe, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// Toggle bookmark formula
router.post('/bookmark-formula', auth, async (req, res) => {
  try {
    const { formulaId } = req.body;
    const user = await User.findById(req.user._id);
    const index = user.savedFormulas.indexOf(formulaId);
    let bookmarked = false;
    if (index > -1) {
      user.savedFormulas.splice(index, 1);
      bookmarked = false;
    } else {
      user.savedFormulas.push(formulaId);
      bookmarked = true;
    }
    await user.save();
    res.json({ savedFormulas: user.savedFormulas, bookmarked });
  } catch (err) {
    res.status(500).json({ message: 'Error bookmarking formula', error: err.message });
  }
});

// Toggle complete topic
router.post('/complete-topic', auth, async (req, res) => {
  try {
    const { topicSlug } = req.body;
    const user = await User.findById(req.user._id);
    const index = user.completedTopics.indexOf(topicSlug);
    let completed = false;
    if (index > -1) {
      user.completedTopics.splice(index, 1);
      completed = false;
    } else {
      user.completedTopics.push(topicSlug);
      completed = true;
    }
    await user.save();
    res.json({ completedTopics: user.completedTopics, completed });
  } catch (err) {
    res.status(500).json({ message: 'Error updating topic status', error: err.message });
  }
});

// 1. Forgot password - generate and send 6-digit OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No registered user found with this email.' });
    }

    // Generate 6 digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpire = expireTime;
    await user.save();

    const { sendOtpEmail } = require('../utils/email');
    await sendOtpEmail(user.email, otp);

    res.json({
      success: true,
      message: 'A 6-digit verification code has been sent to your email.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Failed to process forgot password request.', error: err.message });
  }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and verification code are required.' });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetOtp: otp.toString().trim(),
      resetOtpExpire: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code. Please request a new one.' });
    }

    res.json({ success: true, message: 'Verification code verified successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying code.', error: err.message });
  }
});

// 3. Reset password with verified OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, verification code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetOtp: otp.toString().trim(),
      resetOtpExpire: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code. Please try again.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = null;
    user.resetOtpExpire = null;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password.', error: err.message });
  }
});

module.exports = router;

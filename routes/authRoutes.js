// routes/authRoutes.js
const express = require('express');
const { registerUser, authUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// POST   /api/auth/register
router.post('/register', registerUser);

// POST   /api/auth/login
router.post('/login', authUser);

// GET    /api/auth/profile (Requires JWT)
router.get('/profile', protect, getUserProfile);

module.exports = router;
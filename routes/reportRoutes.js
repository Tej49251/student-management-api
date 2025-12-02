// routes/reportRoutes.js
const express = require('express');
const { getSystemSummary, getMonthlyReport, getAttendanceSummary, getTopPerformers } = require('../controllers/reportController');
const { protect, role } = require('../middleware/authMiddleware');
const router = express.Router();

const admin = role('admin');
const adminOrTeacher = role(['admin', 'teacher']);

// GET /api/reports/summary
router.get('/summary', protect, admin, getSystemSummary);

// GET /api/reports/monthly
router.get('/monthly', protect, admin, getMonthlyReport);

// GET /api/reports/attendance-summary
router.get('/attendance-summary', protect, adminOrTeacher, getAttendanceSummary);

// GET /api/reports/top-performers
router.get('/top-performers', protect, adminOrTeacher, getTopPerformers);

module.exports = router;
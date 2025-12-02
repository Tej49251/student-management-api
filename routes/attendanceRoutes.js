// routes/attendanceRoutes.js
const express = require('express');
const { markAttendance, updateAttendance, getStudentAttendance, getClassAttendance } = require('../controllers/attendanceController');
const { protect, role } = require('../middleware/authMiddleware');
const router = express.Router();

const adminOrTeacher = role(['admin', 'teacher']);

// POST   /api/attendance/mark
router.post('/mark', protect, adminOrTeacher, markAttendance);

// PUT    /api/attendance/update
router.put('/update', protect, adminOrTeacher, updateAttendance);

// GET    /api/attendance/student/:id
router.get('/student/:id', protect, getStudentAttendance);

// GET    /api/attendance/class/:classId (Use query param for date: ?date=YYYY-MM-DD)
router.get('/class/:classId', protect, adminOrTeacher, getClassAttendance);

module.exports = router;
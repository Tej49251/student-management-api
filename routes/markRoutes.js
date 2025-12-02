// routes/markRoutes.js
const express = require('express');
const { submitMarks, getStudentMarks } = require('../controllers/markController');
const { protect, role } = require('../middleware/authMiddleware');
const router = express.Router();

const adminOrTeacher = role(['admin', 'teacher']);

// POST   /api/marks
router.post('/', protect, adminOrTeacher, submitMarks);

// GET    /api/marks/student/:id
router.get('/student/:id', protect, getStudentMarks);

module.exports = router;
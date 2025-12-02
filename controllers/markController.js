// controllers/markController.js
const asyncHandler = require('express-async-handler');
const Mark = require('../models/Mark');
const User = require('../models/User');

// @desc    Submit marks for a student
// @route   POST /api/marks
// @access  Private/Teacher
const submitMarks = asyncHandler(async (req, res) => {
  const { studentId, subject, type, score, maxScore, class: className } = req.body;
  const teacherId = req.user._id;

  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    res.status(404).json({ message: 'Student not found' });
    return;
  }

  // Ensure teacher is authorized to mark this student's class/subject (optional complexity)

  const newMark = await Mark.create({
    student: studentId,
    teacher: teacherId,
    subject,
    type,
    score,
    maxScore: maxScore || 100,
    class: className || student.class,
  });

  res.status(201).json(newMark);
});

// @desc    Get marks records for a single student
// @route   GET /api/marks/student/:id
// @access  Private/Student, Teacher, Admin
const getStudentMarks = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  const { subject, type } = req.query;

  // Role check: A student can only view their own record
  if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
    res.status(403).json({ message: 'Not authorized to view this student\'s marks' });
    return;
  }

  let query = { student: studentId };
  if (subject) query.subject = subject;
  if (type) query.type = type;

  const marksRecords = await Mark.find(query)
    .populate('teacher', 'name email')
    .sort({ createdAt: -1 });

  res.json(marksRecords);
});

module.exports = { submitMarks, getStudentMarks };
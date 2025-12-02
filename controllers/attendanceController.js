// controllers/attendanceController.js
const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Mark attendance for a student
// @route   POST /api/attendance/mark
// @access  Private/Teacher
const markAttendance = asyncHandler(async (req, res) => {
  const { studentId, date, status, class: className } = req.body;
  const teacherId = req.user._id;

  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    res.status(404).json({ message: 'Student not found' });
    return;
  }

  // Check if attendance already exists for the day/class (unique index handles this)
  const dateOnly = new Date(date).setHours(0, 0, 0, 0);

  const newAttendance = await Attendance.create({
    student: studentId,
    teacher: teacherId,
    date: dateOnly,
    class: className || student.class, // Use provided class or student's assigned class
    status,
  });

  res.status(201).json(newAttendance);
});

// @desc    Update a specific attendance record
// @route   PUT /api/attendance/update
// @access  Private/Teacher
const updateAttendance = asyncHandler(async (req, res) => {
  const { attendanceId, status } = req.body;
  const attendance = await Attendance.findById(attendanceId);

  if (attendance) {
    // Optional: Add check to see if the updating teacher is the one who marked it, or if they are admin
    attendance.status = status || attendance.status;
    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } else {
    res.status(404).json({ message: 'Attendance record not found' });
  }
});

// @desc    Get attendance records for a single student
// @route   GET /api/attendance/student/:id
// @access  Private/Student, Teacher, Admin
const getStudentAttendance = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  const { startDate, endDate } = req.query; // Optional filters

  // Role check: A student can only view their own record
  if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
    res.status(403).json({ message: 'Not authorized to view this student\'s attendance' });
    return;
  }

  let query = { student: studentId };

  if (startDate) {
    query.date = { $gte: new Date(startDate) };
  }
  if (endDate) {
    query.date = { ...query.date, $lte: new Date(endDate) };
  }

  const attendanceRecords = await Attendance.find(query)
    .populate('teacher', 'name email') // Show teacher's name
    .sort({ date: -1 });

  res.json(attendanceRecords);
});

// @desc    Get attendance records for a class on a specific date (for verification/review)
// @route   GET /api/attendance/class/:classId
// @access  Private/Teacher, Admin
const getClassAttendance = asyncHandler(async (req, res) => {
  const classId = req.params.classId; // Class name or ID if you use a class model
  const date = req.query.date ? new Date(req.query.date) : new Date().setHours(0, 0, 0, 0);

  const attendanceRecords = await Attendance.find({
    class: classId,
    date: date,
  }).populate('student', 'name studentId');

  res.json(attendanceRecords);
});

module.exports = {
  markAttendance,
  updateAttendance,
  getStudentAttendance,
  getClassAttendance,
};
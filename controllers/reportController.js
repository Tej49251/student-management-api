// controllers/reportController.js
const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get system-wide summary for admin dashboard
// @route   GET /api/reports/summary
// @access  Private/Admin
const getSystemSummary = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalTeachers = await User.countDocuments({ role: 'teacher' });
  const totalAttendanceRecords = await Attendance.countDocuments();
  const totalMarksRecords = await Mark.countDocuments();

  // Calculate overall attendance rate for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const attendanceStats = await Attendance.aggregate([
    { $match: { date: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: null,
        totalRecords: { $sum: 1 },
        totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
      },
    },
  ]);

  const summary = {
    totalStudents,
    totalTeachers,
    totalAttendanceRecords,
    totalMarksRecords,
    last30DaysAttendanceRate: attendanceStats[0]
      ? (attendanceStats[0].totalPresent / attendanceStats[0].totalRecords) * 100
      : 0,
  };

  res.json(summary);
});

// @desc    Get monthly report (e.g., student enrollment or attendance trend)
// @route   GET /api/reports/monthly
// @access  Private/Admin
const getMonthlyReport = asyncHandler(async (req, res) => {
  // Example: Count of students registered per month over the last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyRegistrations = await User.aggregate([
    { $match: { role: 'student', createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    type: 'Monthly Student Registrations',
    data: monthlyRegistrations,
  });
});

// @desc    Get attendance summary (e.g., total present/absent counts per class)
// @route   GET /api/reports/attendance-summary
// @access  Private/Admin, Teacher
const getAttendanceSummary = asyncHandler(async (req, res) => {
  const attendanceSummary = await Attendance.aggregate([
    {
      $group: {
        _id: '$class',
        totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
        totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
        totalLate: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
        totalRecords: { $sum: 1 },
      },
    },
  ]);

  res.json(attendanceSummary);
});

// @desc    Get top performing students based on average mark
// @route   GET /api/reports/top-performers
// @access  Private/Admin, Teacher
const getTopPerformers = asyncHandler(async (req, res) => {
  const topPerformers = await Mark.aggregate([
    // 1. Group by student and calculate average percentage score
    {
      $group: {
        _id: '$student',
        averageScore: { $avg: { $multiply: [{ $divide: ['$score', '$maxScore'] }, 100] } },
        totalMarks: { $sum: 1 },
      },
    },
    // 2. Sort by average score descending
    { $sort: { averageScore: -1 } },
    // 3. Limit to the top N (e.g., 10)
    { $limit: 10 },
    // 4. Join with the User collection to get student details
    {
      $lookup: {
        from: 'users', // The name of the collection (usually plural, 'users')
        localField: '_id',
        foreignField: '_id',
        as: 'studentDetails',
      },
    },
    // 5. Deconstruct the array created by $lookup
    { $unwind: '$studentDetails' },
    // 6. Project the final structure
    {
      $project: {
        _id: 0,
        studentId: '$studentDetails._id',
        name: '$studentDetails.name',
        class: '$studentDetails.class',
        averageScore: { $round: ['$averageScore', 2] },
        totalMarks: 1,
      },
    },
  ]);

  res.json(topPerformers);
});

module.exports = {
  getSystemSummary,
  getMonthlyReport,
  getAttendanceSummary,
  getTopPerformers,
};
// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    class: {
      type: String, // e.g., 'Grade 10A'
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensures a student's attendance is recorded only once per day per class
attendanceSchema.index({ student: 1, date: 1, class: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
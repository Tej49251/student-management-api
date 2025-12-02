// models/Mark.js
const mongoose = require('mongoose');

const markSchema = mongoose.Schema(
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
    subject: {
      type: String, // e.g., 'Mathematics', 'Science'
      required: true,
    },
    type: {
      type: String, // e.g., 'Quiz', 'Midterm', 'Final'
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      default: 100,
    },
    class: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Mark = mongoose.model('Mark', markSchema);
module.exports = Mark;
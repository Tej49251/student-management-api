// routes/studentRoutes.js
const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, role } = require('../middleware/authMiddleware');
const router = express.Router();

// Role-based protection: Only Admins can manage student profiles
const admin = role('admin');
const adminOrTeacher = role(['admin', 'teacher']);

// POST   /api/students
router.post('/', protect, admin, createUser('student'));

// GET    /api/students (Search, Filters, Pagination)
router.get('/', protect, adminOrTeacher, getUsers('student'));

// GET    /api/students/:id
router.get('/:id', protect, adminOrTeacher, getUserById);

// PUT    /api/students/:id
router.put('/:id', protect, admin, updateUser);

// DELETE /api/students/:id
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
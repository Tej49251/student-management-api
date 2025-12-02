// routes/teacherRoutes.js
const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, role } = require('../middleware/authMiddleware');
const router = express.Router();

const admin = role('admin');
const adminOrTeacher = role(['admin', 'teacher']);

// POST   /api/teachers
router.post('/', protect, admin, createUser('teacher'));

// GET    /api/teachers (Search, Filters, Pagination)
router.get('/', protect, adminOrTeacher, getUsers('teacher'));

// GET    /api/teachers/:id (Note: Only show teacher ID list for teachers, not single view from prompt)
router.get('/:id', protect, adminOrTeacher, getUserById);

// PUT    /api/teachers/:id
router.put('/:id', protect, admin, updateUser);

// DELETE /api/teachers/:id
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
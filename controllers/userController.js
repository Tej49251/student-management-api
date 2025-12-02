// controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// --- Helper Functions for Querying (Used in Stage 4) ---
const buildQuery = (role, query) => {
  let dbQuery = { role };

  // Search logic (name or email)
  if (query.search) {
    dbQuery.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  // Example status/class filter
  if (query.class) {
    dbQuery.class = query.class;
  }

  return dbQuery;
};

// @desc    Create a new user (Student/Teacher)
// @route   POST /api/students | /api/teachers
// @access  Private/Admin
const createUser = (role) =>
  asyncHandler(async (req, res) => {
    // Role check is done via middleware, but ensure consistency
    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to create users' });
      return;
    }

    const { name, email, password, studentId, teacherId, class: userClass } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: `${role} already exists with that email` });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      studentId: role === 'student' ? studentId : undefined,
      teacherId: role === 'teacher' ? teacherId : undefined,
      class: userClass,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  });

// @desc    Get all users (Students/Teachers) with Search, Filter & Pagination
// @route   GET /api/students | /api/teachers
// @access  Private/Admin, Teacher
const getUsers = (role) =>
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = buildQuery(role, req.query);

    const users = await User.find(query)
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      total: count,
      page: page,
      pages: Math.ceil(count / limit),
      data: users,
    });
  });

// @desc    Get single user
// @route   GET /api/students/:id | /api/teachers/:id
// @access  Private/Admin, Teacher
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update a user
// @route   PUT /api/students/:id | /api/teachers/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Only allow updating certain fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.class = req.body.class || user.class;
    // ... other updatable fields

    if (req.body.password) {
      user.password = req.body.password; // Pre-save hook will hash it
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Delete a user
// @route   DELETE /api/students/:id | /api/teachers/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
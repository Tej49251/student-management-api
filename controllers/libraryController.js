const asyncHandler = require('express-async-handler');
const LibraryRequest = require('../models/LibraryRequest');

// @desc    Create a new book borrow request
// @route   POST /api/library/request
// @access  Private (Student)
const createRequest = asyncHandler(async (req, res) => {
  const { title, author, image } = req.body;
  
  // 1. Check if student already has a pending or active loan for this specific book
  const existing = await LibraryRequest.findOne({
    student: req.user._id,
    bookTitle: title,
    status: { $in: ['Pending', 'Approved'] }
  });

  if (existing) {
    res.status(400);
    throw new Error('You already have an active request or loan for this book.');
  }

  // 2. Generate a simple token (optional, Mongo ID is usually enough, but let's make a readable one)
  const token = `REQ-${Date.now().toString().slice(-6)}`;

  // 3. Create Request
  const request = await LibraryRequest.create({
    student: req.user._id,
    bookTitle: title,
    bookAuthor: author,
    bookImage: image,
    token: token,
    status: 'Pending'
  });

  res.status(201).json(request);
});

// @desc    Get all requests
// @route   GET /api/library/requests
// @access  Private (Admin sees all, Student sees theirs)
const getRequests = asyncHandler(async (req, res) => {
  let requests;

  if (req.user.role === 'admin') {
    // Admin: Fetch ALL requests, populate student name
    requests = await LibraryRequest.find({})
      .populate('student', 'name email class')
      .sort({ createdAt: -1 });
  } else {
    // Student: Fetch ONLY their requests
    requests = await LibraryRequest.find({ student: req.user._id })
      .sort({ createdAt: -1 });
  }

  res.json(requests);
});

// @desc    Update request status (Approve/Reject/Return)
// @route   PUT /api/library/requests/:id
// @access  Private (Admin Only)
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminMessage } = req.body; // status: 'Approved', 'Rejected', 'Returned'
  
  const request = await LibraryRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Update Status
  request.status = status;
  request.adminMessage = adminMessage || '';

  // Handle Logic based on status
  if (status === 'Approved') {
    request.issueDate = Date.now();
    
    // Set Due Date (e.g., 14 days from now)
    const due = new Date();
    due.setDate(due.getDate() + 14);
    request.dueDate = due;
  
  } else if (status === 'Returned') {
    request.returnDate = Date.now();
  }

  const updatedRequest = await request.save();
  res.json(updatedRequest);
});

module.exports = { createRequest, getRequests, updateRequestStatus };
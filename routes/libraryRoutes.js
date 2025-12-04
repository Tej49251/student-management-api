const express = require('express');
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/libraryController');
const { protect, role } = require('../middleware/authMiddleware');
const router = express.Router();

// Student creates a request
router.post('/request', protect, createRequest);

// Get requests (Logic handles Admin vs Student view inside controller)
router.get('/requests', protect, getRequests);

// Admin updates status (Approve/Reject)
router.put('/requests/:id', protect, role('admin'), updateRequestStatus);

module.exports = router;
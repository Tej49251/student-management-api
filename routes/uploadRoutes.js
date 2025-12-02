// routes/uploadRoutes.js
const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'student-management-profiles', // Folder name in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// 3. Create Multer instance
const upload = multer({ storage: storage });

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Private
// The 'image' string in upload.single('image') must match the field name in the form data
router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    // req.file contains the Cloudinary response object
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path, // The secure URL from Cloudinary
      publicId: req.file.filename,
    });
  } else {
    res.status(400).json({ message: 'No file provided' });
  }
});

module.exports = router;
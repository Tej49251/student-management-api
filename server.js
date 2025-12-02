// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Stage 2 & 3 Routes will be added here ---
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));

app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/marks', require('./routes/markRoutes'));

app.use('/api/reports', require('./routes/reportRoutes'));

app.use('/api/upload', require('./routes/uploadRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
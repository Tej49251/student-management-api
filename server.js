const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Existing Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/marks', require('./routes/markRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/library', require('./routes/libraryRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
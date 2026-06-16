const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/db');
const apiRoutes = require('./src/routes/api');
const sentinelRoutes = require('./src/routes/sentinel');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', apiRoutes);
app.use('/api/v1/sentinel', sentinelRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'UNITY Backend API Service'
  });
});

// Root path mapping
app.get('/', (req, res) => {
  res.send('<h1>UNITY Government Coordination Backend API Gateway</h1><p>Consult API documentation for available endpoints under <code>/api/v1</code>.</p>');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

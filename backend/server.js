const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const { connectDB }    = require('./src/config/db');
const apiRoutes        = require('./src/routes/api');
const sentinelRoutes   = require('./src/routes/sentinel');
const authRoutes       = require('./src/routes/auth');
const civicRoutes      = require('./src/routes/civic');
const citizenRoutes    = require('./src/routes/citizen');

// Load .env (local dev only — Render injects env vars directly)
dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// ─── CORS ──────────────────────────────────────────────────────────────────
// Allow all origins so frontend on Render can reach backend on Render.
// For production hardening, replace '*' with specific frontend origin.
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// ─── Body Parsers ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',     authRoutes);
app.use('/api/v1/sentinel', sentinelRoutes);
app.use('/api/v1/citizen',  citizenRoutes);
app.use('/api/v1',          civicRoutes);
app.use('/api/v1',          apiRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:    'UP',
    timestamp: new Date().toISOString(),
    service:   'UNITY Backend API',
    version:   '2.0.0',
    routes:    ['/api/v1/auth/login', '/api/v1/auth/me', '/health'],
  });
});

// ─── Root ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name:    'UNITY Government Coordination Backend',
    version: '2.0.0',
    status:  'running',
    docs:    '/health',
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[UNITY] Server running on port ${PORT}`);
  console.log(`[UNITY] Auth routes: POST /api/v1/auth/login | GET /api/v1/auth/me`);
  console.log(`[UNITY] Health:      GET /health`);
});

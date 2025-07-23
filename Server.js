const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const { authenticate } = require('./middleware/auth');
const cors = require('cors'); // Add for cross-origin requests
const helmet = require('helmet'); // Add for security headers
const morgan = require('morgan'); // Add for request logging

// Initialize Express
const app = express();

// Enhanced Middleware Stack
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Database Connection with error handling
connectDB().catch(err => {
  console.error('Database connection failed', err);
  process.exit(1);
});

// Route Imports (consistent casing)
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/Booking'); // lowercase
const translationRoutes = require('./routes/Translation'); // lowercase

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', authenticate, bookingRoutes);
app.use('/api/v1/translate', authenticate, translationRoutes);

// Static Files (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 Handler (before error middleware)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ 
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Server Setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = { app, server };
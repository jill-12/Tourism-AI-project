require('dotenv').config();
const express = require('express');
const path = require('path'); // Add path module
const connectDB = require('./config/db');
const { authenticate } = require('./middleware/auth');

// Initialize Express
const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());

// Route Imports (Best Practices)
const authRoutes = require('./routes/auth.js'); // Explicit .js extension
const bookingRoutes = require('./routes/Booking.js');
const translationRoutes = require('./routes/Translation.js');

// Route Middleware
app.use('/api/v1/auth', authRoutes); // Version your API
app.use('/api/v1/bookings', authenticate, bookingRoutes);
app.use('/api/v1/translate', authenticate, translationRoutes);

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error Handling Middleware (Add this last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = { app, server }; // Enhanced export for testing
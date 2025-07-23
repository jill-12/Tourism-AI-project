const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// Get all tours
router.get('/', tourController.getAllTours);

// Get specific tour
router.get('/:id', tourController.getTour);

// Protected admin routes
router.use(authController.authenticate, authController.restrictTo('admin'));

// Create new tour
router.post('/', tourController.createTour);

module.exports = router;
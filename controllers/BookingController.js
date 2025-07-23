const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { tourId, date, participants } = req.body;
    
    // In a real app, you'd calculate price based on tour and user type
    const price = participants * 1500; // Example pricing

    const booking = await Booking.create({
      user: req.user.id,
      tour: tourId,
      date,
      participants,
      price
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
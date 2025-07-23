const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tour: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tour', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(date) {
        return date > new Date(); // Future date only
      },
      message: 'Booking date must be in the future'
    }
  },
  participants: { 
    type: Number, 
    default: 1,
    min: [1, 'At least 1 participant required']
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

// Indexes for faster queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ tour: 1, date: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
const mongoose = require('mongoose')
const { User } = require('.')
const { Schema } = mongoose

const orderSchema = Schema({
  location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  toWatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  screeningTime: {
    type: String,
    enum: [
        "14:15",
        "16:30",
        "18:00",
        "19:30",
    ],
    required: true
  },
  screeningDay: {
      type: Date,
      min: Date.now(),
      max: Date.now() + 1000 * 3600 * 24 * 7
  },
  quality: {
      type: String,
      enum: [
          "2D",
          "IMAX 2D",
          "IMAX 3D"
      ],
      required: true
  }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
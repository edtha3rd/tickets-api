const mongoose = require('mongoose')
const { User } = require('.')
const { Schema } = mongoose

const sessionSchema = Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    reservations: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
    },
    screeningDay: {
      type: Date,
      required: true,
    },
    screeningTime: {
      type: String,
      required: true,
    },
    quality: {
      type: String,
      required: true,
    },
    seatsAvailable: {
      type: Number,
      default: 25,
    },
    seatMap: {
      type: [[String]],
    },
    selectedSeats: {
      type: [String],
    },
  },
  {
    timestamp: true,
    index: {
      expiresAfterSeconds: 3600 * 24 * 14,
    },
  }
)

const Session = mongoose.model('Session', sessionSchema)

module.exports = Session

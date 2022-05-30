const mongoose = require('mongoose')
const { Schema } = mongoose

const reservationSchema = Schema(
  {
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    confirmationCode: {
      type: String,
      index: {
        unique: true,
      },
    },
    seat: {
      type: [String],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Reservation = mongoose.model('Reservation', reservationSchema)

module.exports = Reservation

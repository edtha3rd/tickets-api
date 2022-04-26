const mongoose = require('mongoose')
const { Schema } = mongoose

const seatSchema = Schema({
  row: {
    type: String,
  },
  column: {
    type: Number,
  },
  price: {
    type: Number,
    default: 10,
  },
  selected: {
    type: Boolean,
    required: true,
    default: false,
  },
})

const Seat = mongoose.model('Seat', seatSchema)

module.exports = Seat

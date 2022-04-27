const mongoose = require('mongoose')
const { Schema } = mongoose
const { isEmail } = require('validator')

const userSchema = new Schema({
  address: {
    type: String,
  },
  username: {
    type: String,
    index: {
      unique: true,
    },
  },
  fullName: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    index: {
      unique: true,
    },
    required: true,
    validate: [isEmail, 'invalid email'],
  },
  role: {
    type: String,
    required: false,
    default: 'USER',
    enum: ['USER', 'ADMIN', 'THEATER'],
  },
  password: {
    type: String,
    required: true,
  },
  seats: {
    type: [[Number]],
    default: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  seatsAvailable: {
    type: Number,
    default: 25,
  },
  /*submissions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    catalogue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    } */
})

const User = mongoose.model('User', userSchema)

module.exports = User

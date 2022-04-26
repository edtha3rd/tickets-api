const User = require('./user')
const Movie = require('./movie')
const Review = require('./review')
const Order = require('./order')
const Seat = require('./seat')
const Session = require('./session')
const Reservation = require('./reservation')

const models = {
  Movie,
  Order,
  Reservation,
  Review,
  Seat,
  Session,
  User,
}

module.exports = models

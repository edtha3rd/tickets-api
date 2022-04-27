const { ForbiddenError } = require('apollo-server-core')

module.exports = {
  submissions: async (user, args, { models }) => {
    return await models.Movie.find({ submittedBy: user._id }).sort({ _id: -1 })
  },
  catalogue: async (user, args, { models }) => {
    return await models.Movie.find({ showingAt: user._id }).sort({ _id: -1 })
  },
  //a user has many reviews
  reviewsPosted: async (user, args, { models }) => {
    return await models.Review.find({ author: user._id }).sort({ _id: -1 })
  },
  //a user has many orders
  ordersMade: async (user, args, { models }) => {
    return await models.Order.find({ orderedBy: user._id }).sort({ _id: -1 })
  },
  //a theater also has many orders
  myOrders: async (user, args, { models }) => {
    return await models.Order.find({ location: user._id })
  },
  //a theater has many reservations
  myReservations: async (user, args, { models }) => {
    return await models.Reservation.find().populate({
      path: 'sessionDetails',
      match: { 'location.id': user.id },
    })
  },
  //a user can make many reservations
  reservationsMade: async (user, args, { models }) => {
    return await models.Reservation.find({ reservedBy: user._id })
  },
}

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
  reservationsMade: async (user, args, { models }) => {
    return await models.Reservations.find({ reservedBy: user._id })
  },
}

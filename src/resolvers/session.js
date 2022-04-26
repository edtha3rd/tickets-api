module.exports = {
  //a session is for a single movie
  movie: async (session, args, { models }) => {
    return await models.Movie.findById(session.movie._id)
  },
  //at a single location
  location: async (session, args, { models }) => {
    return await models.User.findById(session.location._id)
  },
  //and it has many reservations for varying numbers of seats
  reservations: async (session, args, { models }) => {
    return await models.Reservation.find({ sessionDetails: session._id }).sort({
      _id: -1,
    })
  },
}

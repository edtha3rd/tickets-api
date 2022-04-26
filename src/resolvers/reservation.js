module.exports = {
  //a reservation is for a particular viewing session
  sessionDetails: async (reservation, args, { models }) => {
    return await models.Session.findById(reservation.sessionDetails._id)
  },
  //by a single user
  reservedBy: async (reservation, args, { models }) => {
    return await models.User.findById(reservation.reservedBy._id)
  },
}

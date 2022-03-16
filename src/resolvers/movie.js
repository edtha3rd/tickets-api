module.exports = {
    submittedBy: async(movie, args, { models }) => {
        return await models.User.findById( movie.submittedBy )
    },
    showingAt: async(movie, args, { models }) => {
        return await models.User.find({ _id: { $in: movie.showingAt } } )
    },
    //a movie has many reviews
    reviews: async(movie, args, { models }) => {
        return await models.Review.find({ reviewOf: movie._id })
    },
    //a movie has many ordered tickets
    orderedTickets: async(movie, args, { models }) => {
        return await models.Order.find({ toWatch: movie._id })
    }
}
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
    }
}
module.exports = {
    submittedBy: async(movie, args, { models }) => {
        return await models.User.findById( movie.submittedBy )
    },
    showingAt: async(movie, args, { models }) => {
        return await models.User.find({ _id: { $in: movie.showingAt } } )
    }
}
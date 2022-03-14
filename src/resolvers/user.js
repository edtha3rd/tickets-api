module.exports = {
    submissions: async (user, args, { models }) => {
        return await models.Movie.find({ submittedBy: user._id }).sort({ _id: -1 })
    },
    catalogue: async (user, args, { models }) => {
        return await models.Movie.find({ showingAt: user._id }).sort({ _id: -1 })
    },
    //a user has many reviews
    reviewsPosted: async (user, args, { models }) => {
        return await models.Review.find({ _id: { $in: user.reviews } }).sort({ _id: -1 })
    }
}
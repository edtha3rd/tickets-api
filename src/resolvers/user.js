module.exports = {
    submissions: async (user, args, { models }) => {
        return await models.Movie.find({ submittedBy: user._id }).sort({ _id: -1 })
    }
}
module.exports = {
    submittedBy: async(movie, args, { models }) => {
        return await models.User.findById( movie.submittedBy )
    }
}
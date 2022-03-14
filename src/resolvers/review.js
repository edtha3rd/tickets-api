module.exports = {
    //a review has a single user
    author: async (review, args, { models }) => {
        return await models.User.findById( review.author )
    },
    //a review has a single movie
    reviewOf: async (review, args, { models }) => {
        return await models.Movie.findById( review.reviewOf._id )
    }
}

module.exports = {
    //users
    users: async (_, args, { models } ) => {
        return await models.User.find()
    },
    user: async (parent, args, { models }) => {
        return await models.User.find(user => user.id === args.id)
    },
    currentUser: async (parent, args, { models, user }) => {
        return await models.User.findById( user.id )
    },
    //movies
    movies: async (_, args, { models } ) => {
        return await models.Movie.find()
    },
    movie: async (parent, args, { models }) => {
        return await models.Movie.findById( args.id )
    },
    MovieFeed: async(parent, args, { models }) => {
        const limit = 10
        let hasMoreMovies = false
        let cursorQuery = {}
        if (args.mCursor){
            cursorQuery = { _id: { $lt: args.cursor }}
        }
        let movies = await models.Movie.find(cursorQuery)
            .sort({ _id: -1 })
            .limit(limit + 1)
        
        if (movies.length > limit){
            hasMoreMovies = true
            movies = movies.slice(0, -1)
        }
        const newmCursor = movies[movies.length - 1]._id

        return {
            movies,
            mCursor: newmCursor,
            hasMoreMovies
        }
    },
    //reviews
    ReviewFeed: async(parent, args, { models }) => {
        const limit = 10
        let hasMoreReviews = false
        let cursorQuery = {}
        if (args.rCursor){
            cursorQuery = { _id: { $lt: args.rCursor }}
        }
        let reviews = await models.Review.find(cursorQuery)
            .sort({ id: -1 })
            .limit(limit + 1)

        if(reviews.length > limit){
            hasMoreReviews = true
            reviews = reviews.slice(0, -1)
        }
        const newrCursor = reviews[reviews.length - 1]._id

        return {
            reviews,
            newrCursor,
            hasMoreReviews
        }
    },
    reviews: async(_, args, { models }) => {
        return await models.Review.find()
    },
    review: async(parent, args, { models }) => {
        return await models.Review.findById( args.id )
    },
    orders: async(_, args, { models }) => {
        return await models.Order.find()
    },
    order: async(parent, args, { models }) => {
        return await models.Order.findById(args.id)
    }
}
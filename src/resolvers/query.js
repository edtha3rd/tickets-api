
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
    }
}
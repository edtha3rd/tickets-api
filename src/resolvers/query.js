
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
    }
}
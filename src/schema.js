const { gql } = require('apollo-server-express')

module.exports = gql`
    type User {
        id: ID!
        username: String
        email: String!
        password: String!
        role: String!
        submissions: [Movie]
        catalogue: [Movie!]!
    }
    type Movie {
        id: ID!
        title: String!
        year: String!
        submittedBy: User!
        showingAt: [User!]
        showingAtCount: Int!
    }
    type Query {
        #user queries
        user(id: ID!): User!
        users: [User]
        currentUser: User!

        #movie queries
        movie(id: ID!): Movie!
        movies: [Movie]
        MovieFeed(mCursor: String!): MovieFeed
    }
    type Mutation {
        #user mutations
        signUp(username: String!, email: String!, password: String!, role: String): String!
        signIn(email: String!, password: String!): String!
        deleteUser(id: ID): Boolean!

        #theater mutations
        toggleCatalogue(id: ID!): Movie!

        #movie mutations
        newMovie(title: String!, year: String!): Movie!
        deleteMovie(id: ID): Boolean!
        editMovie(id:ID!, title: String, year: String): Movie!
    }
    type MovieFeed {
        movies: [Movie]!
        mCursor: String!
        hasMoreMovies: Boolean!
    }
`
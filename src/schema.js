const { gql } = require('apollo-server-express')

module.exports = gql`
    type User {
        id: ID!
        username: String
        email: String!
        password: String!
        role: String!
        submissions: [Movie]
    }
    type Movie {
        id: ID!
        title: String!
        year: String!
        submittedBy: User!
    }
    type Query {
        #user queries
        user(id: ID!): User!
        users: [User]
        currentUser: User!


        #movie queries
        movie(id: ID!): Movie!
        movies: [Movie]
    }
    type Mutation {
        #user mutations
        signUp(username: String!, email: String!, password: String!, role: String): String!
        signIn(email: String!, password: String!): String!
        deleteUser(id: ID): Boolean!

        #movie mutations
        newMovie(title: String!, year: String!): Movie!
        deleteMovie(id: ID): Boolean!
    }
`
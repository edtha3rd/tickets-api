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
        reviewsPosted: [Review!]!
    }
    type Movie {
        id: ID!
        title: String!
        year: String!
        submittedBy: User!
        showingAt: [User!]
        showingAtCount: Int!
        reviews: [Review!]!
    }
    type Review {
        id: ID!
        content: String
        stars: Int!
        author: User!
        reviewOf: Movie!
    }
    type Query {
        #user queries
        user(id: ID!): User!
        users: [User]
        currentUser: User!
        ReviewFeed(rCursor: String): ReviewFeed

        #movie queries
        movie(id: ID!): Movie!
        movies: [Movie]
        MovieFeed(mCursor: String): MovieFeed

        #review queries
        review(id: ID!): Review
        reviews: [Review]
    }
    type Mutation {
        #user mutations
        signUp(username: String!, email: String!, password: String!, role: String): String!
        signIn(email: String!, password: String!): String!
        deleteUser(id: ID): Boolean!
        newReview(movieId: ID!, content: String, stars: Int!): Review!
        deleteReview(id: ID!): Boolean!

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
    type ReviewFeed {
        reviews: [Review]!
        rCursor: String!
        hasMoreComments: Boolean!
    }
`
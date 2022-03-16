const { gql } = require('apollo-server-express')

module.exports = gql`
    scalar DateTime
    type User {
        id: ID!
        username: String
        email: String!
        password: String!
        role: String!
        #ADMIN
        submissions: [Movie]
        #THEATER
        catalogue: [Movie!]!
        myOrders: [Order!]!
        #USER
        reviewsPosted: [Review!]!
        ordersMade: [Order!]!
    }
    type Movie {
        id: ID!
        title: String!
        year: String!
        submittedBy: User!
        showingAt: [User!]
        showingAtCount: Int!
        reviews: [Review!]!
        orderedTickets: [Order!]!
    }
    type Review {
        id: ID!
        content: String
        stars: Int!
        author: User!
        reviewOf: Movie!
    }
    type Order {
        id: ID!
        orderedBy: User! #USER
        toWatch: Movie!
        location: User! #THEATER
        screeningTime: String!
        screeningDay: DateTime!
        quality: String!
    }
    type Ticket {
        id: ID!
        details: Order!
        seatRow: [String!]!
        seatColumn: [Int!]!
        quantity: Int!
        totalCost: Int!
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

        #order queries
        order(id: ID!): Order
        orders: [Order]
    }
    type Mutation {
        #user mutations
        signUp(username: String!, email: String!, password: String!, role: String): String!
        signIn(email: String!, password: String!): String!
        deleteUser(id: ID): Boolean!
        newReview(movieId: ID!, content: String, stars: Int!): Review!
        deleteReview(id: ID!): Boolean!
        newOrder(locationId: ID!, movieId: ID!, screeningTime: String!, screeningDay: DateTime!, quality: String!): Order
        deleteOrder(id: ID!): Boolean!
        newTicket(orderId: ID!, seatRow: [String!], seatColumn: [Int!], quantity: Int!, totalCost: Int!): Ticket

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
const { gql } = require('apollo-server-express')

module.exports = gql`
  scalar DateTime
  scalar Date
  type User {
    id: ID!
    username: String
    email: String!
    password: String!
    role: String!
    #ADMIN
    submissions: [Movie]
    #THEATER
    fullName: String
    address: String
    phoneNumber: String
    catalogue: [Movie!]!
    myOrders: [Order!]!
    myReservations: [Reservation!]!
    seats: [[Int]]
    seatsAvailable: Int
    #USER
    reviewsPosted: [Review!]!
    ordersMade: [Order!]!
    reservationsMade: [Reservation]
  }
  type Movie {
    id: ID!
    title: String!
    year: String!
    poster: String
    synopsis: String
    rating: String
    submittedBy: User!
    showingAt: [User!]
    showingAtCount: Int!
    reviews: [Review!]!
    orderedTickets: [Order!]!
  }
  type PaymentIntent {
    amount: Int
    currency: String
    payment_method_types: [String]
  }
  type Review {
    id: ID!
    content: String
    stars: Int!
    author: User!
    reviewOf: Movie!
  }
  type Reservation {
    createdAt: DateTime
    id: ID!
    reservedBy: User!
    seat: [String]
    sessionDetails: Session!
    totalPrice: Int
    confirmationCode: String
  }
  type Session {
    id: ID!
    location: User!
    movie: Movie!
    quality: String!
    reservations: Reservation
    screeningDay: Date!
    screeningTime: String!
    seatsAvailable: Int
    seatMap: [[String]]
    selectedSeats: [String]
  }
  type Order {
    createdAt: DateTime
    id: ID!
    location: User! #THEATER
    orderedBy: User! #USER
    quality: String!
    screeningTime: String!
    screeningDay: Date!
    toWatch: Movie!
  }
  type Query {
    #user queries
    user(id: ID!): User!
    theaters: [User]
    users: [User]
    currentUser: User!
    ReviewFeed(rCursor: String): ReviewFeed

    #movie queries
    movie(id: ID!): Movie!
    movies: [Movie]
    MovieFeed(mCursor: String): MovieFeed
    submissions: [Movie]
    locations(movieId: ID!): [User]
    catalog(theaterId: ID!): [Movie]

    #review queries
    review(id: ID!): Review
    reviews: [Review]

    #reservations
    reservations: [Reservation]

    #order queries
    order(id: ID!): Order
    orders: [Order]
    myOrders: [Order]

    #session query
    session(
      movieId: ID!
      locationId: ID!
      quality: String!
      screeningTime: String!
      screeningDay: Date!
    ): Session
    sessions: [Session]
  }
  type Mutation {
    #user mutations
    signUp(
      fullName: String
      address: String
      phoneNumber: String
      username: String!
      email: String!
      password: String!
      role: String
    ): String!
    signIn(email: String!, password: String!): String!
    deleteUser(id: ID): Boolean!
    updateUser(fullName: String, address: String, phoneNumber: String): User!
    #payment intent
    retrievePaymentIntent(totalPrice: Int!): String!
    #review
    newReview(movieId: ID!, content: String, stars: Int!): Review!
    deleteReview(id: ID!): Boolean!
    newOrder(
      locationId: ID!
      movieId: ID!
      screeningTime: String!
      screeningDay: Date
      quality: String!
    ): Order
    deleteOrder(id: ID!): Boolean!
    #reservation
    newReservation(
      sessionId: ID!
      seatSelected: [String]
      totalPrice: Int!
    ): Reservation
    deleteReservation(id: ID!): Boolean
    deleteAllReservations: Boolean
    #session
    retrieveSession(
      movieId: ID!
      quality: String!
      screeningDay: Date!
      screeningTime: String!
      locationId: ID!
    ): Session
    updateSession(
      sessionId: ID!
      seatMap: [[String]]
      seatsAvailable: Int
      selectedSeats: [String]
    ): Session
    deleteSession(id: ID!): Boolean

    #theater mutations
    toggleCatalogue(id: ID!): Movie!

    #movie mutations
    newMovie(
      title: String!
      year: String!
      poster: String
      synopsis: String
      rating: String
    ): Movie!
    deleteMovie(id: ID): Boolean!
    editMovie(
      movieId: ID!
      title: String
      year: String
      poster: String
      synopsis: String
      rating: String
    ): Movie!
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

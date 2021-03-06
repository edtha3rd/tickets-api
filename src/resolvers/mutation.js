const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { AuthenticationError, ForbiddenError } = require('apollo-server-express')
require('dotenv').config()
const cloudinary = require('cloudinary')
const sK = process.env.SECRET_KEY
const Stripe = require('stripe')

const stripe = Stripe(sK, { apiVersion: '2020-08-27' })

module.exports = {
  //movies
  newMovie: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be a user')
    }
    active = await models.User.findById(user.id)
    if (active && active.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission')
    }

    return await models.Movie.create({
      title: args.title,
      year: args.year,
      poster: args.poster,
      rating: args.rating,
      synopsis: args.synopsis,
      submittedBy: mongoose.Types.ObjectId(active.id),
    })
  },
  deleteMovie: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be a user')
    }
    active = await models.User.findById(user.id)
    const movieToBeDeleted = await models.Movie.findById(args.id)

    if (
      movieToBeDeleted &&
      String(movieToBeDeleted.submittedBy) !== active.id
    ) {
      throw new ForbiddenError('You do not have the rights')
    }
    try {
      await movieToBeDeleted.remove()
      return true
    } catch (error) {
      return false
    }
  },
  editMovie: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in')
    }
    const movie = await models.Movie.findById(args.movieId)
    const active = await models.User.findById(user.id)

    if (movie && String(movie.submittedBy) !== active.id) {
      throw new ForbiddenError('You do no have the right!')
    }

    return await models.Movie.findOneAndUpdate(
      {
        _id: args.movieId,
      },
      {
        $set: {
          title: args.title,
          year: args.year,
          poster: args.poster,
          synopsis: args.synopsis,
          rating: args.rating,
        },
      },
      {
        new: true,
      }
    )
  },
  toggleCatalogue: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('Please log in')
    }
    active = await models.User.findById(user.id)
    let movieCheck = await models.Movie.findById(args.id)
    const hasTheater = movieCheck.showingAt.indexOf(active.id)

    if (active.role !== 'THEATER') {
      throw new ForbiddenError('Only a theater can perform this action')
    }
    if (hasTheater >= 0) {
      return await models.Movie.findByIdAndUpdate(
        args.id,
        {
          //movie is already in catalog
          $pull: {
            showingAt: mongoose.Types.ObjectId(active.id),
          },
          $inc: {
            showingAtCount: -1,
          },
        },
        {
          new: true,
        }
      )
    } else {
      //movie is not already in catalog
      return await models.Movie.findByIdAndUpdate(
        args.id,
        {
          $push: {
            showingAt: mongoose.Types.ObjectId(active.id),
          },
          $inc: {
            showingAtCount: 1,
          },
        },
        {
          new: true,
        }
      )
    }
  },

  //user mutations
  signUp: async (parent, args, { models }) => {
    email = args.email.trim().toLowerCase()

    const hashed = await bcrypt.hash(args.password, 10)
    try {
      const user = await models.User.create({
        username: args.username,
        email,
        fullName: args.fullName,
        address: args.address,
        mobileNumber: args.mobileNumber,
        role: args.role ? args.role : 'USER',
        password: hashed,
      })
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    } catch (error) {
      // console.log(error)
      throw new Error('Error creating account')
    }
  },
  signIn: async (parent, args, { models }) => {
    if (args.email) {
      email = args.email.trim().toLowerCase()
    }
    const me = await models.User.findOne({
      email: email,
    })
    if (!me) {
      throw new AuthenticationError('User not found')
    }
    const valid = await bcrypt.compare(args.password, me.password)
    if (!valid) {
      throw new AuthenticationError('Credentials do not match')
    }
    return jwt.sign({ id: me._id }, process.env.JWT_SECRET)
  },
  deleteUser: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You need to be signed in')
    }
    const userToBeDeleted = await models.User.findById(args.id)
    try {
      await userToBeDeleted.remove()
      return true
    } catch (error) {
      return false
    }
  },
  updateUser: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in')
    }

    return await models.User.findByIdAndUpdate(
      {
        _id: user.id,
      },
      {
        $set: {
          fullName: args.fullName,
          address: args.address,
          phoneNumber: args.phoneNumber,
        },
      }
    )
  },
  //payment intent
  retrievePaymentIntent: async (parent, args, { models }) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: args.totalPrice * 100,
        currency: 'cny',
        payment_method_types: ['card'],
      })

      const clientSecret = paymentIntent.client_secret

      return clientSecret
    } catch (e) {
      console.log(e.message)
    }
  },
  //review
  newReview: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    active = await models.User.findById(user.id)
    reviewedMovie = await models.Movie.findById(args.movieId)

    if (active && active.role !== 'USER') {
      throw new ForbiddenError('Only users can leave reviews')
    }
    // console.log(reviewedMovie)
    return await models.Review.create({
      content: args.content,
      stars: args.stars,
      author: mongoose.Types.ObjectId(active.id),
      reviewOf: mongoose.Types.ObjectId(reviewedMovie.id),
    })
  },
  deleteReview: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    active = await models.User.findById(user.id)
    const reviewToBeDeleted = await models.Review.findById(args.id)

    if (
      reviewToBeDeleted &&
      String(reviewToBeDeleted.author._id) !== active.id &&
      active.role !== 'ADMIN'
    ) {
      throw new ForbiddenError('You do not have the right!')
    }
    try {
      reviewToBeDeleted.remove()
      return true
    } catch (error) {
      return false
    }
  },
  deleteOrder: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    active = await models.User.findById(user.id)
    const orderToBeDeleted = await models.Order.findById(args.id)

    //if((orderToBeDeleted))
    try {
      orderToBeDeleted.remove()
      return true
    } catch (error) {
      return false
    }
  },
  newOrder: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    active = await models.User.findById(user.id)
    movie = await models.Movie.findById(args.movieId)
    atCinema = await models.User.findById(args.locationId)
    if (active && active.role !== 'USER') {
      throw new ForbiddenError('Only a user can order a ticket')
    }
    return await models.Order.create({
      orderedBy: mongoose.Types.ObjectId(active.id),
      location: mongoose.Types.ObjectId(args.locationId),
      toWatch: mongoose.Types.ObjectId(args.movieId),
      screeningTime: args.screeningTime,
      screeningDay: args.screeningDay,
      quality: args.quality,
    })
  },
  newReservation: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    active = await models.User.findById(user.id)
    return await models.Reservation.create({
      confirmationCode: Math.random().toString(16).substring(2, 12),
      reservedBy: mongoose.Types.ObjectId(active.id),
      sessionDetails: mongoose.Types.ObjectId(args.sessionId),
      seat: args.seatSelected,
      totalPrice: args.totalPrice,
    })
  },
  deleteReservation: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    const reservationToBeDeleted = await models.Reservation.findById(args.id)

    //if((orderToBeDeleted))
    try {
      reservationToBeDeleted.remove()
      return true
    } catch (error) {
      return false
    }
  },
  deleteAllReservations: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    // const reservationsToBeDeleted = await models.Reservation.find()
    try {
      await models.Reservation.deleteMany()
      return true
    } catch (error) {
      console.log(error.message)
      return false
    }
  },
  retrieveSession: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    // active = await models.User.findById(user.id)
    // console.log(args)
    // movie = await models.Movie.findById(args.movieId)
    // atCinema = await models.User.findById(args.locationId)
    let session = await models.Session.findOne({
      movie: mongoose.Types.ObjectId(args.movieId),
      location: mongoose.Types.ObjectId(args.locationId),
      quality: args.quality,
      screeningDay: args.screeningDay,
      screeningTime: args.screeningTime,
    })
    // console.log(session)
    if (!session) {
      // console.log('not session')
      return await models.Session.create({
        location: mongoose.Types.ObjectId(args.locationId),
        movie: mongoose.Types.ObjectId(args.movieId),
        screeningTime: args.screeningTime,
        screeningDay: args.screeningDay,
        quality: args.quality,
        seatMap: [
          ['1', '2', '3', '4', '5'],
          ['6', '7', '8', '9', '10'],
          ['11', '12', '13', '14', '15'],
          ['16', '17', '18', '19', '20'],
          ['21', '22', '23', '24', '25'],
        ],
      })
    } else {
      // console.log('session')
      return await session
    }
  },
  updateSession: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    // const reservation = models.Reservation.findById(args.reservationId)
    return await models.Session.findOneAndUpdate(
      {
        _id: args.sessionId,
      },
      {
        $set: {
          seatsAvailable: args.seatsAvailable,
        },
        $push: {
          selectedSeats: args.selectedSeats,
        },
      },
      {
        new: true,
      }
    )
  },
  deleteSession: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be logged in')
    }
    active = await models.User.findById(user.id)
    const sessionToBeDeleted = await models.Session.findById(args.id)

    //if((orderToBeDeleted))
    try {
      sessionToBeDeleted.remove()
      return true
    } catch (error) {
      return false
    }
  },
}

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { 
        AuthenticationError,
        ForbiddenError        
} = require('apollo-server-express')
const { MongoCredentials } = require('mongoose/node_modules/mongodb')
const movie = require('./movie')
require('dotenv').config()

module.exports = {
    //movies
    newMovie: async(parent, args, { models, user }) => {
        console.log(user)
        if(!user){
            throw new AuthenticationError('You must be a user')
        }
        active = await models.User.findById(user.id)
        if(active && active.role !== 'ADMIN') {
            throw new ForbiddenError('You do not have permission')
        }
        return await models.Movie.create({
            title: args.title,
            year: args.year,
            submittedBy: mongoose.Types.ObjectId(active.id)
        })
    },
    deleteMovie: async(parent, args, { models, user }) => {
        if(!user){
            throw new AuthenticationError('You must be a user')
        }
        active = await models.User.findById(user.id)
        const movieToBeDeleted = await models.Movie.findById(args.id)

        if(movieToBeDeleted && String(movieToBeDeleted.submittedBy) !== active.id){
            throw new ForbiddenError('You do not have the rights')
        }
        try {
            await movieToBeDeleted.remove()
            return true
        } catch (error) {
            return false
        }
    },
    editMovie: async(parent, args, { models, user }) => {
        if(!user){
            throw new AuthenticationError('You must be signed in')
        }
        const movie = await models.Movie.findById(args.id)
        active = await models.User.findById(user.id)
        if(movie && String(movie.submittedBy) !== active.id){
            throw new ForbiddenError('You do no have the right!')
        }
        return await models.Movie.findOneAndUpdate(
            {
                _id: args.id,
            },
            {
                $set: {
                    title: args.title,
                    year: args.year
                }
            },
            {
                new: true
            }
        )
    },
    toggleCatalogue: async(parent, args, { models, user }) => {
        if (!user){
            throw new AuthenticationError('Please log in')
        }
        active = await models.User.findById(user.id)
        let movieCheck = await models.Movie.findById(args.id)
        const hasTheater = movieCheck.showingAt.indexOf(active.id)

        if (active.role !== "THEATER"){
            throw new ForbiddenError('Only a theater can perform this action')
        }
        if (hasTheater >= 0){
            return await models.Movie.findByIdAndUpdate(args.id,
                { //movie is already in catalog
                    $pull: {
                        showingAt: mongoose.Types.ObjectId(active.id)
                    },
                    $inc: {
                        showingAtCount: -1
                    }
                }, {
                    new: true
                }
            )
        } else { //movie is not already in catalog
            return await models.Movie.findByIdAndUpdate(args.id,
                {
                    $push: {
                        showingAt: mongoose.Types.ObjectId(active.id)
                    },
                    $inc: {
                        showingAtCount: 1
                    }
                }, {
                    new: true
                }
            )
        }
    },

    //user mutations
    signUp: async(parent, args, { models, }) => {
        email = args.email.trim().toLowerCase()
        
        const hashed = await bcrypt.hash(args.password, 10)

        try {
            const user = await models.User.create({
                username: args.username,
                email,
                role: args.role,
                password: hashed
            })
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET )
        } catch (error) {
            console.log(error)
            throw new Error('Error creating account')
        }
    },
    signIn: async(parent, args, { models }) => {
        if (args.email){
            email = args.email.trim().toLowerCase()
        }
        const me = await models.User.findOne({ 
            email: email
        })
        if (!me){
            throw new AuthenticationError('User not found')
        }
        const valid = await bcrypt.compare(args.password, me.password)
        if (!valid) {
            throw new AuthenticationError('Credentials do not match')
        }
        return jwt.sign({ id: me._id }, process.env.JWT_SECRET)
    },
    deleteUser: async (parent, args, { models, user }) => {
        if(!user){
            throw new AuthenticationError('You need to be signed in')
        }
        const userToBeDeleted = await models.User.findById(args.id)
        try {
            await userToBeDeleted.remove()
            return true
        } catch (error) {
            return false
        }
    }
}
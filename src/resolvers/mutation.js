const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { 
        AuthenticationError,
        ForbiddenError        
} = require('apollo-server-express')
const { MongoCredentials } = require('mongoose/node_modules/mongodb')
require('dotenv').config()

module.exports = {
    //movies
    newMovie: async(parent, args, { models, user }) => {
        console.log(user)
        if(!user){
            throw new AuthenticationError('You must be a user')
        }
        active = await models.User.findById(user.id)
        console.log(active)
        if(active && active.role !== 'ADMIN') {
            throw new ForbiddenError('You do not have permission')
        }
        return await models.Movie.create({
            title: args.title,
            year: args.year,
            submittedBy: mongoose.Types.ObjectId(active.id)
        })
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
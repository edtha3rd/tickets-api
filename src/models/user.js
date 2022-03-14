const mongoose = require('mongoose')
const { Schema } = mongoose
const { isEmail } = require('validator')

const userSchema = new Schema({
    username: {
        type: String,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        index: {
            unique: true
        },
        required: true,
        validate: [isEmail, 'invalid email']
    },
    role: {
        type: String,
        required: false,
        default: "USER",
        enum: ["USER", "ADMIN", "THEATER"]
    },
    password: {
        type: String,
        required: true
    },
    /*submissions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    catalogue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    } */
})

const User = mongoose.model('User', userSchema)

module.exports = User

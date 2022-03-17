const mongoose = require('mongoose')
const { Schema } = mongoose

const movieSchema = Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    poster: {
        type: String
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    showingAt: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    showingAtCount: {
        type: Number,
        default: 0
    }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie
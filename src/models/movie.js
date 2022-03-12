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
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie
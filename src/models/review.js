const mongoose = require('mongoose')
const { Schema } = mongoose

const reviewSchema = Schema({
    content: {
        type: String,
    },
    stars: {
        type: Number,
        required: true,
        default: 3,
        min: 0,
        max: 5
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
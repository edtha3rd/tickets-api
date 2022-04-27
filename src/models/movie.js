const mongoose = require('mongoose')
const { Schema } = mongoose

const movieSchema = Schema({
  poster: {
    type: String,
  },
  rating: {
    type: String,
    default: 'G',
    enum: ['G', 'PG', 'PG:13', 'R', 'NC-17'],
  },
  synopsis: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  showingAt: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  showingAtCount: {
    type: Number,
    default: 0,
  },
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie

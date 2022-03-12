const mongoose = require('mongoose')
require('dotenv').config()

uri = process.env.DB_URI;

module.exports = {
    connect: uri => {
        mongoose.connect(uri)

        mongoose.connection.on('error', err => {
            console.error(err)
            console.log('MongoDB connection error. Please check your connection')
            process.exit()
        })
    }
}

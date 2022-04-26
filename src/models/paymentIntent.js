const mongoose = require('mongoose')
const { Schema } = mongoose

const paymentIntentSchema = Schema({
  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  payment_method_type: {
    type: [String],
  },
})

const PaymentIntent = mongoose.model('PaymentIntent', paymentIntentSchema)

module.exports = PaymentIntent

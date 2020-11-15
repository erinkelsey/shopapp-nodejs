const mongoose = require('mongoose')

const Schema = mongoose.Schema 
/**
 * Mongoose schema for a Order model.
 */
const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Object,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  userId: {
    type: Schema.Types.ObjectId,
    required: true, 
    ref: 'User'
  }
})

/**
 * Order model with mongoose schema productSchema
 */
module.exports = mongoose.model('Order', orderSchema)
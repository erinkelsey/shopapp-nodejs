const mongoose = require('mongoose')

const Schema = mongoose.Schema

/**
 * Mongoose schema for a Product model.
 */
const productSchema = new Schema({
  title: {
    type: String, 
    required: true
  },
  price: {
    type: Number, 
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  imageUrl: {
    type: String, 
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

/**
 * Product model with mongoose schema productSchema
 */
module.exports = mongoose.model('Product', productSchema)
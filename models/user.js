const mongoose = require('mongoose')

const Schema = mongoose.Schema

/**
 * Mongoose schema for a User model.
 */
const userSchema = new Schema({
  email: {
    type: String, 
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }
})

/**
 * Method for User model to add a product to their cart. 
 * 
 * @param {Product} product the product to add to the cart
 */
userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString()
  })
  const updatedCartItems = [ ...this.cart.items ]

  if (cartProductIndex >= 0) {
    const newQuantity = this.cart.items[cartProductIndex].quantity + 1
    updatedCartItems[cartProductIndex].quantity = newQuantity
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1
    })
  }

  this.cart = {
    items: updatedCartItems
  }

  this.save()
}

/**
 * Method for User model to delete a product from their cart. 
 * 
 * @param {String} productId ID for the product to delete
 */
userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString()
  })
  this.cart.items = updatedCartItems
  return this.save()
}

/**
 * Method for User model to clear all items from their cart.
 */
userSchema.methods.clearCart = function() {
  this.cart = { items: [] }
  this.save()
}

/**
 * Product model with mongoose schema productSchema
 */
module.exports = mongoose.model('User', userSchema)
const Product = require('./product')

const cart = { products: [], totalPrice: 0 }

/**
 * Model for holding products the user has added to their
 * cart, and the current total price of the cart. 
 */
module.exports = class Cart {
  /**
   * Add a product to this cart. 
   * 
   * @param {String} id ID of the product to add to this cart
   */
  static addProduct(id) {
    Product.findById(id, product => {
      const existingProductIndex = cart.products.findIndex(p => p.id === id)
      const existingProduct = cart.products[existingProductIndex]
  
      if (existingProduct) {
        let updatedProduct = {  ...existingProduct }
        updatedProduct.quantity += 1
        cart.products = [ ...cart.products ]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        cart.products = [  ...cart.products, { id: id, quantity: 1 } ]
      }
  
      cart.totalPrice += +product.price
    })
  }
}

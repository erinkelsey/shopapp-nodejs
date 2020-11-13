let cart = { products: [], totalPrice: 0 }

/**
 * Model for holding products the user has added to their
 * cart, and the current total price of the cart. 
 */
module.exports = class Cart {
  /**
   * Add a product to this cart. 
   * 
   * @param {String} id ID of the product to add to this cart
   * @param {String} productPrice price of product to delete
   */
  static addProduct(id, productPrice) {
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

    cart.totalPrice += +productPrice
    console.log(cart);
  }

  /**
   * Deletes a product from this cart. 
   * 
   * Alters the total price of the cart in response to the deletion. 
   * Including if there is more than one of the product in the cart.
   * 
   * @param {String} id ID for the product to delete from the cart
   * @param {String} productPrice price of product to delete
   */  
  static deleteProductById(id, productPrice) {
    const cartProduct = cart.products.find(p => p.id === id)
    
    if (!cartProduct) return

    let updatedCart = { ...cart }
    updatedCart.totalPrice = cart.totalPrice - +productPrice * cartProduct.quantity

    updatedCart.products = cart.products.filter(p => p.id !== id)
    cart = updatedCart
    console.log(cart)
  }

  /**
   * Returns the entire cart in callback function
   * 
   * @param {Function} cb callback function to handle cart 
   */
  static getCart(cb) {
    cb(cart)
  }
}

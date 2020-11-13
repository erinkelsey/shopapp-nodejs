const Product = require('./product')

const cart = { products: [], totalPrice: 0 }

module.exports = class Cart {
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
  
      console.log(cart);
    })
  }
}

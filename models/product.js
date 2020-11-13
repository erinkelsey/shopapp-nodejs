const Cart = require('./cart')

let products = []

/**
 * Model for a single product item. 
 */
module.exports = class Product {
  /**
   * Constructor for a product item.
   * 
   * @param {String} title the title of this product
   * @param {String} imageUrl url for the image of this product
   * @param {String} description description of this product
   * @param {Double} price price of this product
   */
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  /**
   * Save method for saving this product.
   * 
   * Either add a new product, or update an existing product.
   */
  save() {
    if (this.id) {
      const existingProductIndex = products.findIndex(p => p.id === this.id)
      const updatedProducts = [...products]
      updatedProducts[existingProductIndex] = this
      products = updatedProducts
    } else {
      this.id = Math.random().toString()
      const updatedProducts = [ ...products, this ]
      products = updatedProducts
    }
  }

  /**
   * Static method for fetching all products.
   * 
   * Called by: Product.fetchAll()
   */
  static fetchAll(cb) {
    cb(products)
  }

  /**
   * Find a product by it's ID. 
   * 
   * @param {String} id ID of the product to find
   * @param {Function} cb callback function 
   */
  static findById(id, cb) {
    const product = products.find(p => p.id === id)
    cb(product)
  }

  /**
   * Deletes a specific product. 
   * 
   * Deletes product from any current carts, as well.
   * 
   * @param {String} id ID of product to delete
   * @param {String} productPrice price of product to delete
   */
  static deleteById(id, productPrice) {
    const updatedProducts = products.filter(p => p.id !== id)
    products = updatedProducts
    Cart.deleteProductById(id, productPrice)
  }

}
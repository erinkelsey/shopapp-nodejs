const products = []

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
   * Either add a new product, or updating an existing product.
   */
  save() {
    if (this.id) {
      const existingProductIndex = products.findIndex(p => p.id === this.id)
      const updatedProducts = [...products]
      products[existingProductIndex] = this
    } else {
      this.id = Math.random().toString()
      products.push(this)
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

  static findById(id, cb) {
    const product = products.find(p => p.id === id)
    cb(product)
  }

}
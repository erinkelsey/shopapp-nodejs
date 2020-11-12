const products = []

/**
 * Model for a single product item. 
 */
module.exports = class Product {
  /**
   * Constructor for a product item.
   * 
   * @param {String} title the title of the product
   */
  constructor(title) {
    this.title = title
  }

  /**
   * Save method for saving this product.
   */
  save() {
    products.push(this)
  }

  /**
   * Static method for fetching all products.
   * 
   * Called by: Product.fetchAll()
   */
  static fetchAll() {
    return products
  }

}
const Product = require('../models/product')

/**
 * Function for rendering the shop view. 
 */
exports.getProducts = (req, res, next) => {
  res.render('shop', {
    products: Product.fetchAll(),
    pageTitle: 'Shop',
  })
}

/**
 * Function for rendering the add-product view.
 */
exports.getAddProduct = (req, res, next) => {
  res.render('add-product', { pageTitle: 'Add Product' })
}

/**
 * Function for handling adding a new product. 
 * 
 * Redirects to main route when complete.
 */
exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title)
  product.save()
  res.redirect('/')
}
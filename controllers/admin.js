const Product = require('../models/product')

/**
 * Controller for rendering the admin add-product view.
 */
exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', { 
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  })
}

/**
 * Controller for handling adding a new product. 
 * 
 * Redirects to main route when complete.
 */
exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title, req.body.imageUrl, req.body.description, req.body.price)
  product.save()
  res.redirect('/')
}

/**
 * Controller for rendering the admin products view. 
 */
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      products: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
  })
}
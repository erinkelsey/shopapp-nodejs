const Product = require('../models/product')

/**
 * Controller for rendering the admin add-product view.
 */
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { 
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

/**
 * Controller for handling adding a new product. 
 * 
 * Redirects to main route when complete.
 */
exports.postAddProduct = (req, res, next) => {
  const product = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price)
  product.save()
  res.redirect('/')
}

/**
 * Controller for rendering the edit product page. 
 */
exports.getEditProduct = (req, res, next) => {
  Product.findById(req.params.productId, product => {
    if (!product) res.redirect('/')

    res.render('admin/edit-product', { 
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: req.query.edit,
      product: product
    })
  })
}

/**
 * Controller for handling editing a product. 
 * 
 * Redirects to main page, if product ID is invalid. 
 * 
 * Redirects to admin products page, if successful.
 */
exports.postEditProduct = (req, res, next) => {
  Product.findById(req.body.productId, product => {
    if (!product) res.redirect('/')
    const updatedProduct = new Product(req.body.productId, req.body.title, req.body.imageUrl, req.body.description, req.body.price)
    updatedProduct.save()
    res.redirect('/admin/products')
  })
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
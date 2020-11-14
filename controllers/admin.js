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
  Product.create({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description
  })
    .then(result => {
      console.log(result)
      res.redirect('/')
    })
    .catch(err => console.log(err))
}

/**
 * Controller for rendering the edit product page. 
 */
exports.getEditProduct = (req, res, next) => {
  Product.findByPk(req.params.productId)
    .then(product => {
      if (!product) res.redirect('/')

      res.render('admin/edit-product', { 
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: req.query.edit,
        product: product
      })
    })
  .catch(err => console.log(err))
}

/**
 * Controller for handling editing a product. 
 * 
 * Redirects to main page, if product ID is invalid. 
 * 
 * Redirects to admin products page, if successful.
 */
exports.postEditProduct = (req, res, next) => {
  Product.findByPk(req.body.productId)
    .then(product => {
      product.title = req.body.title
      product.price = req.body.price 
      product.description = req.body.description 
      product.imageUrl = req.body.imageUrl
      return product.save()
    })
    .then(result => {
      console.log('UPDATED PRODUCT')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

/**
 * Controller for rendering the admin products view. 
 */
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        products: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      })
    })
    .catch(err => console.log(err))
}

/**
 * Controller for handling the deletion of a single product. 
 * 
 * Deletes product from any carts it is currently in, as well.
 */
exports.postDeleteProduct = (req, res, next) => {
  Product.findByPk(req.body.productId)
    .then(product => {
      return product.destroy()
    })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}
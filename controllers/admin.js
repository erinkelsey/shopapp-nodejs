const { validationResult } = require('express-validator')

const fileHelper = require('../util/file')

const Product = require('../models/product')

/**
 * Controller for rendering the admin add-product view.
 */
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { 
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false
  })
}

/**
 * Controller for handling adding a new product. 
 * 
 * Redirects to main route when complete.
 * 
 * Checks for validation errors, if errors, redirect to add product page. 
 */
exports.postAddProduct = (req, res, next) => {
  // Validation and File Upload Errors
  const errors = validationResult(req)
  const image = req.file
  if (!errors.isEmpty() || !image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: !errors.isEmpty() ? errors.array()[0].msg : 'Unable to upload file. Please select an image of type PNG, JPG, or JPEG.',
      hasError: true,
      product: { 
        title: req.body.title,
        price: req.body.price,
        description: req.body.description
      }
    })
  }

  // Add Product
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imageUrl: image.path,
    description: req.body.description,
    userId: req.user
  })
  product
    .save()
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
      // res.redirect('/500')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for rendering the edit product page. 
 */
exports.getEditProduct = (req, res, next) => {
  Product
    .findById(req.params.productId)
    .then(product => {
      if (!product) res.redirect('/')

      res.render('admin/edit-product', { 
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: req.query.edit,
        product: product,
        hasError: false
      })
    })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

/**
 * Controller for handling editing a product. 
 * 
 * Redirects to main page, if product ID is invalid, or user was 
 * not the one that added the product. 
 * 
 * Redirects to admin products page, if successful.
 * 
 * Checks for validation errors, if errors, redirect to add product page.
 * 
 * If there is no image file sent, then keeps the original one.
 * 
 * If there is an image, original image is deleted from server. 
 */
exports.postEditProduct = (req, res, next) => {
  // Validation Errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: { 
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        _id: req.body.productId
      }
    })
  }

  Product 
    .findById(req.body.productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) 
        return res.redirect('/')

      const image = req.file 

      product.title = req.body.title
      product.price = req.body.price 
      product.description = req.body.description 

      if (image) {
        fileHelper.deleteFile(product.imageUrl)
        product.imageUrl = image.path
      }

      return product.save().then(() => {
        res.redirect('/admin/products')
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for rendering the admin products view. 
 * 
 * Only returns products that the user has added. 
 */
exports.getProducts = (req, res, next) => {
  Product 
    .find({ 'userId': req.user._id })
    // .select('title price -_id') // select only title, price and exclude id
    // .populate('userId') // populate related fields with full objects
    .then(products => {
      res.render('admin/products', {
        products: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for handling the deletion of a single product. 
 * 
 * Deletes product from any carts it is currently in, as well.
 * 
 * Deletes the file from the server, as well. 
 */
exports.deleteProduct = (req, res, next) => {
  Product 
    .findByIdAndRemove(req.params.productId)
    .then(product => {
      if (!product) return next(new Error('Product not found.'))
      fileHelper.deleteFile(product.imageUrl)

      return Product.deleteOne( { _id: req.params.productId, userId: req.user._id } )
    })
    .then(() => res.status(200).json({
      message: 'Success!'
    }))
    .catch(err => {
      res.status(500).json({
        message: 'Deleing product failed.'
      })
    })
}
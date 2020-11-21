const fs = require('fs')
const path = require('path')

const PDFDocument = require('pdfkit')

const Product = require('../models/product')
const Order = require('../models/order')

/**
 * Controller for rendering the shop view. 
 * 
 * The main index view for the app.
 */
exports.getIndex = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/index', {
        products: products,
        pageTitle: 'Shop',
        path: '/'
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for rendering the view containing all of the
 * products of the shop. 
 */
exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/product-list', {
        products: products,
        pageTitle: 'All Products',
        path: '/products'
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for rendering the view for a specific product's details. 
 */
exports.getProduct = (req, res, next) => {
  Product
    .findById(req.params.productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/product-detail',
        product: product
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for rendering a user's shopping car view.
 */
exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for adding a product to the user's cart. 
 * 
 * Redirects to the cart page.
 */
exports.postCart = (req, res, next) => {
  Product
    .findById(req.body.productId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for deleting a product from the user's cart. 
 * 
 * Redirects to the cart page.
 */
exports.postCartDeleteProduct = (req, res, next) => {
  req.user.removeFromCart(req.body.productId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

// /**
//  * Controller for rendering a user's checkout view.
//  */
// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   })
// }

/**
 * Controller for handling ordering cart items. 
 * 
 * Redirects to orders page when complete. 
 */
exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return { 
          quantity: item.quantity,
          product: {...item.productId._doc}
        }
      })
      const order = new Order({
        userId: req.user, // SAME as req.user._id
        products: products
      })
      order.save()
    })
    .then(() => {
      return req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for rendering a user's orders view.
 */
exports.getOrders = (req, res, next) => {
  Order
    .find({ 'userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

/**
 * Controller for sending the invoice to the user. 
 * 
 * Creates and returns the PDF invoice for the specific order. 
 * 
 * Must be one of this user's orders. 
 */
exports.getInvoice = (req, res, next) => {
  // Check user can view order 
  Order
    .findById(req.params.orderId)
    .then(order => {
      if (!order)
        return next(new Error('No order found.'))
      if (order.userId.toString() !== req.user._id.toString())
        return next(new Error('Unauthorized'))

      const invoiceName = 'invoice-' + req.params.orderId + '.pdf'
      const invoicePath = path.join('data', 'invoices', invoiceName)
    
      // create PDF
      const pdfDoc = new PDFDocument()
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
      pdfDoc.pipe(fs.createWriteStream(invoicePath))
      pdfDoc.pipe(res)
    
      pdfDoc.fontSize(26).text('Invoice', { underline: true })
      
      pdfDoc.text('-------------------------');
  
      let totalPrice = 0
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price
        pdfDoc.fontSize(12).text(prod.product.title + ' - ' + prod.quantity + ' x ' + ' $ ' + prod.product.price)
      })
  
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text("Total Price: $" + totalPrice)
    
      // send PDF
      pdfDoc.end()
    })
    .catch(err => next(err))
}
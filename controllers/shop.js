const Product = require('../models/product')
const Cart = require('../models/cart')

/**
 * Controller for rendering the shop view. 
 * 
 * The main index view for the app.
 */
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        products: products,
        pageTitle: 'Shop',
        path: '/'
      })
    })
    .catch(err => console.log(err))
}

/**
 * Controller for rendering the view containing all of the
 * products of the shop. 
 */
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        products: products,
        pageTitle: 'All Products',
        path: '/products'
      })
    })
    .catch(err => console.log(err))
}

/**
 * Controller for rendering the view for a specific product's details. 
 */
exports.getProduct = (req, res, next) => {
  Product.findByPk(req.params.productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/product-detail',
        product: product
      })
    })
    .catch(err => console.log(err))
}

/**
 * Controller for rendering a user's shopping car view.
 */
exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = []
      for (product of products) {
        const cartProductData = cart.products.find(p => p.id === product.id)
        if (cartProductData)
          cartProducts.push({ productData: product, quantity: cartProductData.quantity})
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      })
    })
  })
}

/**
 * Controller for adding a product to the user's cart. 
 * 
 * Redirects to the cart page.
 */
exports.postCart = (req, res, next) => {
  Product.findById(req.body.productId, product => {
    Cart.addProduct(req.body.productId, product.price)
    res.redirect('/cart')
  })
}

/**
 * Controller for deleting a product from the user's cart. 
 * 
 * Redirects to the cart page.
 */
exports.postCartDeleteProduct = (req, res, next) => {
  Product.findById(req.body.productId, product => {
    Cart.deleteProductById(req.body.productId, product.price)
    res.redirect('/cart')
  })
}

/**
 * Controller for rendering a user's checkout view.
 */
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}

/**
 * Controller for rendering a user's orders view.
 */
exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  })
}
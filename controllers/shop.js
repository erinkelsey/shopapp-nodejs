const Product = require('../models/product')

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
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
    })
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      })
    })
    .catch(err => console.log(err))
}

/**
 * Controller for adding a product to the user's cart. 
 * 
 * Redirects to the cart page.
 */
exports.postCart = (req, res, next) => {
  let fetchedCart
  let newQuantity = 1
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: req.body.productId } })
    })
    .then(products => {
      if (products.length > 0) {
        const quantity = products[0].cartItem.quantity
        newQuantity  = quantity + 1
        return products[0]
      }
      return Product.findByPk(req.body.productId)
        .then(product => product)
        .catch(err => console.log(err))
    })
    .then(product => {
      return fetchedCart.addProduct(product, { 
        through: { quantity: newQuantity } 
      })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

/**
 * Controller for deleting a product from the user's cart. 
 * 
 * Redirects to the cart page.
 */
exports.postCartDeleteProduct = (req, res, next) => {
  req.user.getCart()
    .then(cart => cart.getProducts({ where: { id: req.body.productId } }))
    .then(products => products[0].cartItem.destroy())
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
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
 * Controller for handling ordering cart items. 
 * 
 * Redirects to orders page when complete. 
 */
exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product
          }))
        })
        .catch(err => console.log(err))
    })
    .then(() => {
      return fetchedCart.setProducts(null)
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

/**
 * Controller for rendering a user's orders view.
 */
exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] })
    .then(orders => {
      console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      })
    })
    .catch(err => console.log(err))
  
}
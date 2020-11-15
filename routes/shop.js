const express = require('express')

const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

/**
 * GET method for / route.
 * 
 * Renders the index page.
 */
router.get('/', shopController.getIndex)

/**
 * GET method for /products route.
 * 
 * Renders the user page showing all of the products.
 */
router.get('/products', shopController.getProducts)

/**
 * GET method for /products/:productId route. 
 * 
 * Renders the page for showing the details for a specific
 * product, based on the productId parameter.
 */
router.get('/products/:productId', shopController.getProduct)

/**
 * GET method for /cart route.
 * 
 * Renders a user's cart page.
 * 
 * User must be logged in to access this route.
 */
router.get('/cart', isAuth, shopController.getCart)

/**
 * POST method for /cart route. 
 * 
 * Handles adding a product to the user's cart. 
 * 
 * User must be logged in to access this route.
 */
router.post('/cart', isAuth, shopController.postCart)

/**
 * POST method for /cart-delete-item route. 
 * 
 * Handles deleting a specific item from the user's cart.
 * 
 * User must be logged in to access this route.
 */
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

// /**
//  * GET method for /checkout route. 
//  * 
//  * Renders a user's checkout page.
//  * 
//  * User must be logged in to access this route.
//  */
// router.get('/checkout', isAuth, shopController.getCheckout)

/**
 * POST method for /create-order route. 
 * 
 * Handles ordering cart items. 
 * 
 * User must be logged in to access this route.
 */
router.post('/create-order', isAuth, shopController.postOrder)

/**
 * GET method for /orders route. 
 * 
 * Renders a user's orders page.
 * 
 * User must be logged in to access this route.
 */
router.get('/orders', isAuth, shopController.getOrders)

module.exports = router
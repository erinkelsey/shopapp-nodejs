const express = require('express')

const shopController = require('../controllers/shop')

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
 */
router.get('/cart', shopController.getCart)

/**
 * POST method for /cart route. 
 * 
 * Handles adding a product to the user's cart. 
 */
router.post('/cart', shopController.postCart)

/**
 * POST method for /cart-delete-item route. 
 * 
 * Handles deleting a specific item from the user's cart.
 */
router.post('/cart-delete-item', shopController.postCartDeleteProduct)

/**
 * GET method for /checkout route. 
 * 
 * Renders a user's checkout page.
 */
router.get('/checkout', shopController.getCheckout)

/**
 * GET method for /orders route. 
 * 
 * Renders a user's orders page.
 */
router.get('/orders', shopController.getOrders)

module.exports = router
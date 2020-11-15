const express = require('express')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

/**
 * GET method for /admin/add-product route. 
 * 
 * Renders the admin page for adding a product.
 * 
 * User must be logged in to access this route.
 */
router.get('/add-product', isAuth, adminController.getAddProduct)

/**
 * POST method for /admin/add-product route. 
 * 
 * Handles post request for an admin adding a new product.
 * 
 * User must be logged in to access this route.
 */
router.post('/add-product', isAuth, adminController.postAddProduct)

/**
 * GET method for /admin/products route.
 * 
 * Renders the admin page showing all of the products.
 * 
 * User must be logged in to access this route.
 */
router.get('/products', isAuth,  adminController.getProducts)

/**
 * GET method for /admin/edit-product/:productId route.
 * 
 * Renders the admin page for editing a product.
 * 
 * User must be logged in to access this route.
 */
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

/**
 * POST method for /admin/edit-product route. 
 * 
 * Handles post request for an admin editing a product.
 * 
 * User must be logged in to access this route.
 */
router.post('/edit-product', isAuth, adminController.postEditProduct)

/**
 * POST method for /admin/delete-product route. 
 * 
 * Handles post request for an admin deleting a product.
 * 
 * User must be logged in to access this route.
 */
router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router
const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

/**
 * GET method for /admin/add-product route. 
 * 
 * Renders the admin page for adding a product.
 */
router.get('/add-product', adminController.getAddProduct)

/**
 * POST method for /admin/add-product route. 
 * 
 * Handles post request for an admin adding a new product.
 */
router.post('/add-product', adminController.postAddProduct)

/**
 * GET method for /admin/products route.
 * 
 * Renders the admin page showing all of the products.
 */
router.get('/products', adminController.getProducts)

/**
 * GET method for /admin/edit-product/:productId route.
 * 
 * Renders the admin page for editing a product.
 */
router.get('/edit-product/:productId', adminController.getEditProduct)

/**
 * POST method for /admin/edit-product route. 
 * 
 * Handles post request for an admin editing a product.
 */
router.post('/edit-product', adminController.postEditProduct)

/**
 * POST method for /admin/delete-product route. 
 * 
 * Handles post request for an admin deleting a product.
 */
router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router
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
 * GET method for /admin/products route.
 * 
 * Renders the admin page showing all of the products.
 */
router.get('/products', adminController.getProducts)

/**
 * POST method for /admin/add-product route. 
 * 
 * Handles post request for an admin adding a new product.
 */
router.post('/add-product', adminController.postAddProduct)

module.exports = router
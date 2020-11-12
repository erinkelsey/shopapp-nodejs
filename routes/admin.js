const express = require('express')

const productsController = require('../controllers/products')

const router = express.Router()

/**
 * Route for GET method for /admin/add-product 
 */
router.get('/add-product', productsController.getAddProduct)

/**
 * Route for POST method for /admin/add-product 
 */
router.post('/add-product', productsController.postAddProduct)

module.exports = router
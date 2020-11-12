const path = require('path')

const express = require('express')

const productsController = require('../controllers/products')

const router = express.Router()

/**
 * Route for GET method for / 
 * 
 * Renders the shop page.
 */
router.get('/', productsController.getProducts)

module.exports = router
const express = require('express')
const { body } = require('express-validator')

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
 * 
 * Validates user input:
 *  - title -> alphanumeric, min lenght of 3
 *  - imageUrl -> must be URL
 *  - title -> float
 *  - description -> min length of 5, max lenght of 400
 */
router.post(
  '/add-product', 
  isAuth, 
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .withMessage('Title must have only letters and numbers, and have a minimum of three characters.')
      .trim(),
    body('imageUrl')
      .isURL()
      .withMessage('Image URL must be a valid URL.'),
    body('price')
      .isFloat()
      .withMessage('Price must be a valid float.'),
    body('description')
      .isLength({ min: 5, max: 400 })
      .withMessage('Description must be between 5 and 400 characters long.')
      .trim(),
  ],
  adminController.postAddProduct
)

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
router.get(
  '/edit-product/:productId', isAuth, adminController.getEditProduct)

/**
 * POST method for /admin/edit-product route. 
 * 
 * Handles post request for an admin editing a product.
 * 
 * User must be logged in to access this route.
 * 
 * Validates user input:
 *  - title -> alphanumeric, min lenght of 3
 *  - imageUrl -> must be URL
 *  - title -> float
 *  - description -> min length of 5, max lenght of 400
 */
router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .withMessage('Title must have only letters and numbers, and have a minimum of three characters.')
      .trim(),
    body('imageUrl')
      .isURL()
      .withMessage('Image URL must be a valid URL.'),
    body('price')
      .isFloat()
      .withMessage('Price must be a valid float.'),
    body('description')
      .isLength({ min: 5, max: 400 })
      .withMessage('Description must be between 5 and 400 characters long.')
      .trim(),
  ], 
  isAuth, 
  adminController.postEditProduct
)

/**
 * POST method for /admin/delete-product route. 
 * 
 * Handles post request for an admin deleting a product.
 * 
 * User must be logged in to access this route.
 */
router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router
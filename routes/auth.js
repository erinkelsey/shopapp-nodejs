const express = require('express')

const authController = require('../controllers/auth')

const router = express.Router()

/**
 * GET method for /login route. 
 * 
 * Renders login page.
 */
router.get('/login', authController.getLogin)

/**
 * POST method for /login route. 
 * 
 * Handles login authentication. 
 */
router.post('/login', authController.postLogin)

/**
 * POST method for /logout route. 
 * 
 * Handles logging a user out. 
 */
router.post('/logout', authController.postLogout)

/**
 * GET method for /signup route. 
 * 
 * Renders signup page.
 */
router.get('/signup', authController.getSignUp)

/**
 * POST method for /signup route. 
 * 
 * Handles signing up a user. 
 */
router.post('/signup', authController.postSignUp)

/**
 * GET method for /reset route. 
 * 
 * Renders reset password page.
 */
router.get('/reset', authController.getReset)

/**
 * POST method for /reset route. 
 * 
 * Handles resetting a user's password. 
 */
router.post('/reset', authController.postReset)

/**
 * GET method for /reset/:token route. 
 * 
 * Renders new password page.
 */
router.get('/reset/:token', authController.getNewPassword)

/**
 * POST method for /new-password route. 
 * 
 * Resets a user's password. 
 */
router.post('/new-password', authController.postNewPassword)

module.exports = router;
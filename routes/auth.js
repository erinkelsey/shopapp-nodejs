const express = require('express')
const { check, body } = require('express-validator')

const authController = require('../controllers/auth')
const User = require('../models/user')

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
 * 
 * Validates the following fields:
 *  - email -> is an email
 *  - password -> must be more than 5 chars, alphanumeric
 */
router.post(
  '/login', 
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
  body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  authController.postLogin
)

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
 * 
 * Validates the following fields:
 *  - email -> is an email
 *  - password -> must be more than 5 chars, alphanumeric
 *  - confirmPassword -> must be equal to password
 */
router.post(
  '/signup', 
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User
          .findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('Email address already exists.')
            }
          })
      })
      .normalizeEmail(),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    check('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match.')
        }
        return true
      })
      .trim()
  ], 
  authController.postSignUp
)

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
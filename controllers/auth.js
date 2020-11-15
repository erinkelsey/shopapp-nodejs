const bcrypt = require('bcryptjs')

const User = require("../models/user")

/**
 * Controller for rendering a login view.
 */
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error')
  })
}

/**
 * Controller for handling login authentication. 
 */
exports.postLogin = (req, res, next) => {
  User 
    .findOne( { email: req.body.email } )
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect('/login')
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then(matched => {
          if (matched) {
            req.session.isLoggedIn = true 
            req.session.user = user
            return req.session
              .save(() => res.redirect('/'))
          } 
          req.flash('error', 'Invalid email or password.')
          res.redirect('/login')
        })
        .catch(() => res.redirect('/login'))
    })
    .catch(err => console.log(err))
}

/**
 * Controller for logging this user out. 
 */
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  }) 
}

/**
 * Controller for rendering a sign up view.
 */
exports.getSignUp = (req, res,  next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error')
  })
}

/**
 * Controller for handling signing up a user. 
 */
exports.postSignUp = (req, res, next) => {
  User
    .findOne({ email: req.body.email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email already exists.')
        return res.redirect('/signup')
      }
      bcrypt
        .hash(req.body.password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: req.body.email,
            password: hashedPassword,
            cart: { items: [] }
          })
          return user.save()
        })
    })
    .then(() => {
      res.redirect('/login')
    })
    .catch(err => console.log(err))
}
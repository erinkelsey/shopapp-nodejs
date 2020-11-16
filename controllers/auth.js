const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const User = require("../models/user")

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}))

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
 * 
 * Sends the user an email, confirming that successful sign up. 
 * 
 * Hashes the user's password with bcrypt. 
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
      return transporter.sendMail({
        to: req.body.email,
        from: process.env.SENDGRID_FROM,
        subject: 'Sign up succeeded!',
        html: '<h1>You successfully signed up!</h1>'
      })
    })
    .catch(err => console.log(err))
}

/**
 * Controller for rendering reset password view.
 */
exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('error')
  })
}

/**
 * Controller for handling the creation of a token, and sending
 * the user an email with the token, so that they can reset
 * their password. 
 * 
 * Only sends the reset email, if the user has entered a valid email. 
 */
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }

    const token = buffer.toString('hex')
    User
      .findOne( { email: req.body.email } )
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.')
          return res.redirect('/reset')
        }

        user.resetToken = token 
        user.resetTokenExpiration = Date.now() + 3600000
        user
          .save()
          .then(() => {
            res.redirect('/')
            return transporter.sendMail({
              to: req.body.email,
              from: process.env.SENDGRID_FROM,
              subject: 'Password reset!',
              html: `
                <p>You requested a password reset.</p>
                <p>Click this <a href="${process.env.HOST_URL}/reset/${token}">link</a> to set a new password.</p>
              `
            })
          })
      })
      .catch(err => console.log(err))
  })
}

/**
 * Controller for rendering password reset page. 
 * 
 * NOTE: add error message if token/user not found
 */
exports.getNewPassword = (req, res, next) => {
  User
    .findOne( { resetToken: req.params.token, resetTokenExpiration: { $gt: Date.now() } } )
    .then(user => {
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: req.flash('error'),
        userId: user._id.toString(),
        passwordToken: req.params.token
      })
    })
    .catch(err => console.log(err))
}

/**
 * Controller for handling password resets. 
 * 
 * Password is only reset, if user has a valid token. 
 * 
 * Redirects to login page. 
 * 
 * NOTE: add error message if token/user not found
 */
exports.postNewPassword = (req, res, next) => {
  let resetUser
  User.findOne({ 
    resetToken: req.body.passwordToken, 
    resetTokenExpiration: { $gt: Date.now() } ,
    _id: req.body.userId
  })
  .then(user => { 
    resetUser = user
    return bcrypt.hash(req.body.password, 12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword
    resetUser.resetToken = undefined
    resetUser.resetTokenExpiration = undefined 
    return resetUser.save()
  })
  .then(() => {
    res.redirect('/login')
  })
  .catch(err => console.log(err))
}
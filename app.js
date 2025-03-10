require("dotenv").config()

const path = require('path')

const express = require("express")
const bodyParser = require('body-parser') 
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()
const store = new MongoDBStore({
  uri: process.env.MONGODB_CONNECTION,
  collection: 'sessions'
})
const csrfProtection = csrf()

/**
 * Set up file storage for product images. 
 * 
 * They are stored in an images folder. 
 */
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images')
//   },
//   filename: (req, file, cb) => {
//     console.log('getting filename')
//     cb(null, new Date().toISOString() + '_' + file.originalname)
//   }
// })

/**
 * Configure AWS SDK and S3, for uploading images. 
 */
aws.config.update({ region: process.env.AWS_REGION })
const s3 = new aws.S3({apiVersion: '2006-03-01'})

const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, new Date().toISOString() + '_' + file.originalname)
  }
})

/**
 * File filter for uploaded files. 
 * 
 * Only save image files with .png/.jpg/.jpeg file types. 
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
    cb(null, true)
  cb(null, false)
}

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

/**
 * Middleware for parsing the body of requests. 
 * 
 * Both urlencoded, and form-data. 
 */
app.use(bodyParser.urlencoded({extended: false}))
app.use(multer({ storage: s3Storage, fileFilter }).single('image')) // image is field name

/**
 * Middleware for static files. 
 */
app.use(express.static(path.join(__dirname, 'public')))
// app.use('/images', express.static(path.join(__dirname, 'images')))

/**
 * Middleware for handling sessions. 
 */
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
)

/**
 * Middleware for CSRF tokens and protection
 */
app.use(csrfProtection)

/**
 * Middleware for flash messages
 */
app.use(flash())

/**
 * Middleware for adding user to request.
 */
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

/**
 * Middleware for adding authentication status and CSRF tokens
 * to every response. 
 */
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

/**
 * Routes for app. 
 */
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

/**
 * Route for 500 page. 
 */
app.get('/500', errorController.get500)

/**
 * If the routes aren't handled above, show 404 page. 
 */
app.use(errorController.get404)

/**
 * Error handling middleware. Will be reached if an error
 * is returned from another route. 
 */
app.use((error, req, res, next) => {
  res.redirect('/500')
})

/**
 * Connect to MongoDB, and listen on port 3000.
 */
mongoose
  .connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3000)
  })
  .catch(err => console.log(err))
const path = require('path')

const express = require('express')

const adminData = require('./admin')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('shop', {
    prods: adminData.products,
    pageTitle: 'Shop',
  })
})

module.exports = router
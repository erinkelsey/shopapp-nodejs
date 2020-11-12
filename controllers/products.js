const products = []

exports.getProducts = (req, res, next) => {
  res.render('shop', {
    products: products,
    pageTitle: 'Shop',
  })
}

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', { pageTitle: 'Add Product' })
}

exports.postAddProduct = (req, res, next) => {
  products.push({'title': req.body.title})
  res.redirect('/')
}
/**
 * Function for rendering the 404 page.
 */
exports.get404 = (req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
  res.status(404).render('404', { 
    pageTitle: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn
  })
}

/**
 * Function for rendering the 500 page.
 */
exports.get500 = (req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
  res.status(500).render('500', { 
    pageTitle: 'Server Error Occurred',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  })
}
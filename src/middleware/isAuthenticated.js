// middleware/isAuthenticated.js
function isAuthenticated(req, res, next) {
  // Check if user is authenticated
  if (req.session && req.session.user) {
    return next(); // User is authenticated, proceed to the route
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/login');
  }
}

module.exports = isAuthenticated;

// middleware/isAuthenticated.js
function isAuthenticated(req, res, next) {
  // Check if user is authenticated
  if (req.session && (req.session.user) ){
    console.log("Authenticated");
    return next(); // User is authenticated, proceed to the route
  } else {
    // User is not authenticated, redirect to login page
    console.log("no authenticated");
    res.send("Unauthorized please login");
    
  }
}

module.exports = isAuthenticated;

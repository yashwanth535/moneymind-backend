// middleware/isAuthenticated.js

function isAuthenticated(req, res, next) {
  // Check if user is authenticated
  console.log("Inside authentication check:");
  console.log("User session data:", JSON.stringify(req.session.user));
  
  if (req.session.user) {
    console.log("User is authenticated.");
    return next();
  } else {
    console.log("User is not authenticated. Redirecting to home.");
    return res.render('home'); // This will render the home page if the user is not authenticated.
  }
}

module.exports = isAuthenticated;

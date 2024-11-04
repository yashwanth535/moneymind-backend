// middleware/isAuthenticated.js
function isAuthenticated(req, res, next) {
  // Check if user is authenticated
  if (req.session && (req.session.user) ){
    console.log("Authenticated");
    return next(); // User is authenticated, proceed to the route
  } else {
    // User is not authenticated, redirect to login page
    console.log("no authenticated");
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>UNAUTHOURIZED</title>
      </head>
      <body>
          <p style="display:inline-block;">Unauthorized, Please <a href='/signin'">signin</a><p>
          
      </body>
      </html>
  `);
    

  }
}

module.exports = isAuthenticated;
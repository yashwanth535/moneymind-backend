// middleware/isAuthenticated.js
const mongoose=require('mongoose');
async function isAuthenticated(req, res, next) {
  // Check if user is authenticated
  if (req.session && (req.session.user) ){
    console.log("Authenticated");
    if (mongoose.connection.readyState !== 0) {
      console.log("connection exits");
    }
    else{
      const email=req.session.user.email;
      const dbName = email.replace(/[@.]/g, '_'); // Replace both `@` and `.` with `_`
        const new_url = `${process.env.URL_PARTONE}${dbName}${process.env.URL_PARTTWO}`;
      await mongoose.connect(new_url)
                .then(() => {
                  console.log('Connected to database:', dbName);
                })
                .catch((error) => {
                  console.error('Error in connection:', error.message);
                });
      
    }
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
          <p style="display:inline-block;">Unauthorized, Please <a href="/?showSignin=true">signin</a><p>
      </body>
      </html>
  `);
    

  }
}

module.exports = isAuthenticated;
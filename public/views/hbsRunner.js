const express=require('express');
const app = express();
const hbs = require("hbs");
const path = require("path");
const viewsPath = path.join(__dirname, '../views');
const partialsPath = path.join(__dirname, "../partials");

  app.set("view engine", "hbs");
  app.set("views", viewsPath);
  hbs.registerPartials(partialsPath);

  app.use(express.static(path.join(__dirname, '../../public')));
app.get('/',(req,res)=>{
  res.render('landing');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);

});

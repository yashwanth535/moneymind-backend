const express=require('express');
const hbs=require('hbs');
const path=require("path");
const app=express();
app.set("view engine","hbs");
const viewsPath = path.join(__dirname, '/template')
app.set("views",viewsPath);
const partialsPath = path.join(__dirname, "/template/partials");
hbs.registerPartials(partialsPath);
app.use(express.static(path.join(__dirname, '/public')));
console.log(viewsPath);

app.get('/',(req,res)=>{
  res.render('signin');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);

});

const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const session = require("express-session");
const axios = require("axios")
const bookController = require('./controllers/bookcontroller'); 
const passport = require('passport');



const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: 'secret1',
  resave: true,
  saveUninitialized: true
}));                                        


app.get("/", async (req, res) => {
  const books = await bookController.getBooks();
  res.render("home.ejs", { books });
});


app.use('/', require('./routes/user'))
app.use('/books', require('./routes/books'))
app.use('/about', require('./routes/about'))
app.use('/logged', require('./routes/logged'))





app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  
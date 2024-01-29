const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const session = require("express-session");
const passport = require('passport');
const router = express.Router();
const bookController = require('../controllers/bookcontroller'); 




router.get("/", async (req, res) => {
  const books = await bookController.getBooks();
  res.render("logged.ejs", { books });
});


module.exports = router;
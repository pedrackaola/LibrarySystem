const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require('../modules/db')
const bookController = require('../controllers/bookcontroller'); 



router.get("/", async (req, res) => {
    const searchTerm = req.body.q;
    const books = await bookController.getBooks();
  
      const enteredWord = req.query.word;
      res.render("books.ejs", { books, enteredWord, searchTerm });
  });
  
  
  
  router.post("/", async (req, res) => {
    const searchTerm = req.body.q;
    const books = await bookController.getBooks();
      const enteredWord = req.body.word;
      res.render("books.ejs", { books, enteredWord, searchTerm });
  
    });
  
  
    router.get("/:title", async (req, res) => {
      const bookTitle = req.params.title;
    
      try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${bookTitle}`);
        const book = response.data.docs[0];
    
        if (book) {
          const coverID = book.cover_i;
    
          if (coverID) {
            const coverImageUrl = `https://covers.openlibrary.org/b/id/${coverID}-L.jpg`;
            book.coverUrl = coverImageUrl;
          } else {
            book.coverUrl = '';
          }
          res.render("bookDetails.ejs", { book });
        } else {
          res.status(404).send("Book not found");
        }
      } catch (error) {
        console.error("Error fetching book details:", error.message);
        res.status(500).send("Internal Server Error");
      }
  });
  

  module.exports = router;
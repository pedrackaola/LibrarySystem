const axios = require('axios');

                                   
async function getBooks() {
      const response = await axios.get('https://openlibrary.org/search.json?person=harry+potter&limit=9');
      const books = response.data.docs.map(book => ({
        title: book.title,
        author: book.author_name ? book.author_name.join(', ') : 'Unknown',
        year: book.first_publish_year || 'Unknown',
        coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
      }));
  
      return books;

  };
  
module.exports = {
    getBooks,
  };

                                                                                                                                            
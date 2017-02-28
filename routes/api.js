const express = require('express');
const router = express.Router();
const models = require('../models');

/**
 * Books routes
 */

/** Get books */
router.get('/books', function(req, res, next) {
  let attributes = {};
  let include = [models.Genre, models.Author];
  if (req.query.titles) { 
    attributes = ['id', 'title', 'available'];
    include = [];
  }
  models.Book.findAll({
    attributes: attributes,
    include: include
  })
    .then(function(books) {
      res.send(books);
    });
});

/** Create book */
router.post('/books', function(req, res, next) {
  models.Book.create(req.body)
    .then(function(book) {
      return book.dataValues.id;
    })
    .then(function(id) {
      return models.Book.findById(id, {
        include: [models.Genre, models.Author]
      });
    })
    .then(function(book) {
      res.send(book);
    })
    .catch(function() {
      res.sendStatus(403);
    })
});

/** Update book */
router.put('/books/:id', function(req, res, next) {
  models.Book.findById(req.params.id)
    .then(function(book){
      if (!book) {
        throw new Error();
      }
      return book.update(req.body);
    })
    .then(function(book) {
      res.send(book);
    })
    .catch(function() {
      res.sendStatus(403);        
    });
});

/** Delete book */
router.delete('/books/:id', function(req, res, next) {
  models.Book.findById(req.params.id)
    .then(function(book) {
      if (!book) {
        throw new Error();
      }
      return book.destroy();
    })
    .then(function() {
      res.sendStatus(200);
    })
    .catch(function() {
      res.sendStatus(403);
    });
});

/**
 * Patrons routes
 */

/** Get patrons */
router.get('/patrons', function(req, res, next) {
  let attributes = {};
  if (req.query.names) {  
    attributes = ['id', [models.sequelize.literal("first_name || ' ' || last_name"), 'full_name']]
  }
  models.Patron.findAll({
    attributes: attributes
  })
    .then(function(patrons) {
      res.send(patrons);
    });
});

/** Create patron */
router.post('/patrons', function(req, res, next) {
  models.Patron.create(req.body)
    .then(function(patron) {
      res.send(patron);
    })
    .catch(function() {
      res.sendStatus(403);
    })
});

/** Update patron */
router.put('/patrons/:id', function(req, res, next) {
  models.Patron.findById(req.params.id)
    .then(function(patron){
      if (!patron) {
        throw new Error();
      }
      return patron.update(req.body);
    })
    .then(function(patron) {
      res.send(patron);
    })
    .catch(function() {
      res.sendStatus(403);        
    });
});

/** Delete patron */
router.delete('/patrons/:id', function(req, res, next) {
  models.Patron.findById(req.params.id)
    .then(function(patron) {
      if (!patron) {
        throw new Error();
      }
      return patron.destroy();
    })
    .then(function() {
      res.sendStatus(200);
    })
    .catch(function() {
      res.sendStatus(403);
    });
});

/**
 * Loans routes
 */

/** Get loans */
router.get('/loans', function(req, res, next) {
  models.Loan.findAll({
    include: [
        {
          model: models.Patron,
          attributes: ['id', [models.sequelize.literal("first_name || ' ' || last_name"), 'full_name']]
        },
        {
          model: models.Book,
          attributes: ['id', 'title', 'available']
        }
      ]
  })
    .then(function(loans) {
      res.send(loans);
    });
});

/** Create loan */
router.post('/loans', function(req, res, next) {
  models.Loan.create(req.body)
    .then(function(loan) {
      return loan.dataValues.id;
    })
    .then(function(id) {
      return models.Loan.findById(id, {
        include: [
          {
            model: models.Patron,
            attributes: ['id', [models.sequelize.literal("first_name || ' ' || last_name"), 'full_name']]
          },
          {
            model: models.Book,
            attributes: ['id', 'title', 'available']
          }
        ]
      })
    })
    .then(function(loan) {
      res.send(loan)
    })
    .catch(function() {
      res.sendStatus(403);
    })
});

/** Update loan */
router.put('/loans/:id', function(req, res, next) {
  let oldLoan;
  let newLoan;

  models.Loan.findById(req.params.id)
    .then(function(loan){
      if (!loan) {
        throw new Error();
      }
      oldLoan = Object.assign({}, loan.dataValues);
      return loan.update(req.body);
    })
    .then(function(loan) {
      newLoan = Object.assign({}, loan.dataValues);
      // check if loan book was returned
      if (!oldLoan.returned_on && newLoan.returned_on) {
        // return the book
        loan.returnBook();
      }
      // check if loan doesn't returned and the book was changed
      else if (!oldLoan.returned_on && !newLoan.returned_on) {
        if (oldLoan.book_id !== newLoan.book_id) {
          // return the old book and borrow the new one
          loan.returnBook(oldLoan);
          loan.borrowBook(newLoan);
        }
      }
      // check if The book was borrowed
      else if (oldLoan.returned_on && !newLoan.returned_on) {
        // borrow the new book
        loan.borrowBook(newLoan);
      }

      res.send(loan);
    })
    .catch(function(error) {
      console.log(error)        
      res.sendStatus(403);        
    });
});

/** Delete loan */
router.delete('/loans/:id', function(req, res, next) {
  models.Loan.findById(req.params.id)
    .then(function(loan) {
      if (!loan) { 
        throw new Error();
      }
      return loan.destroy();
    })
    .then(function(loan) {
      res.send(loan);
    })
    .catch(function() {
      res.sendStatus(403);
    });
});

/**
 * Genres routes
 */

/** Get genres  */
router.get('/genres', function(req, res, next) {
  models.Genre.findAll()
    .then(function(genres) {
      res.send(genres);
    })
    .catch(function() {
      res.sendStatus(403);
    });
});

/** Create genre */
router.post('/genres', function(req,res, next) {
  models.Genre.create(req.body)
    .then(function(genre) {
      res.send(genre)
    })
    .catch(function() {
      console.log(req.body);
      res.sendStatus(403);
    });
});

/**
 * Authors routes
 */

/** Get authors  */
router.get('/authors', function(req, res, next) {
  models.Author.findAll()
    .then(function(authors) {
      res.send(authors);
    })
    .catch(function() {
      res.sendStatus(403);
    });
});

/** Create author */
router.post('/authors', function(req,res, next) {
  models.Author.create(req.body)
    .then(function(author) {
      res.send(author)
    })
    .catch(function() {
      res.sendStatus(403);
    });
});

module.exports = router;
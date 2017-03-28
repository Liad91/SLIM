const express = require('express');
const router = express.Router();
const models = require('../models');

/**
 * Books routes
 */

/** Get books */
router.get('/books', (req, res, next) => {
  const attributes = req.query.titles ? ['id', 'title', 'available'] : {};
  const include = req.query.titles ? [] : [models.Genre, models.Author];

  models.Book.findAll({
    attributes: attributes,
    include: include
  })
    .then(books => {
      res.send(books);
    });
});

/** Create book */
router.post('/books', (req, res, next) => {
  models.Book.create(req.body)
    .then(book => book.dataValues.id)
    .then(id => {
      return models.Book.findById(id, {
        include: [models.Genre, models.Author]
      });
    })
    .then(book => {
      res.send(book);
    })
    .catch(() => {
      res.sendStatus(403);
    })
});

/** Update book */
router.put('/books/:id', (req, res, next) => {
  models.Book.findById(req.params.id)
    .then(book => {
      if (!book) {
        throw new Error();
      }
      return book.update(req.body);
    })
    .then(book => {
      res.send(book);
    })
    .catch(() => {
      res.sendStatus(403);        
    });
});

/** Delete book */
router.delete('/books/:id', (req, res, next) => {
  models.Book.findById(req.params.id)
    .then(book => {
      if (!book) {
        throw new Error();
      }
      return book.destroy();
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(403);
    });
});

/**
 * Patrons routes
 */

/** Get patrons */
router.get('/patrons', (req, res, next) => {
  models.Patron.findAll()
    .then(patrons => {
      res.send(patrons);
    });
});

/** Create patron */
router.post('/patrons', (req, res, next) => {
  models.Patron.create(req.body)
    .then(patron => {
      res.send(patron);
    })
    .catch(() => {
      res.sendStatus(403);
    })
});

/** Update patron */
router.put('/patrons/:id', (req, res, next) => {
  models.Patron.findById(req.params.id)
    .then(patron => {
      if (!patron) {
        throw new Error();
      }
      return patron.update(req.body);
    })
    .then(patron => {
      res.send(patron);
    })
    .catch(() => {
      res.sendStatus(403);        
    });
});

/** Delete patron */
router.delete('/patrons/:id', (req, res, next) => {
  models.Patron.findById(req.params.id)
    .then(patron => {
      if (!patron) {
        throw new Error();
      }
      return patron.destroy();
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(403);
    });
});

/**
 * Loans routes
 */

/** Get loans */
router.get('/loans', (req, res, next) => {
  models.Loan.findAll({
    include: [
        {
          model: models.Patron,
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: models.Book,
          attributes: ['id', 'title', 'available']
        }
      ]
  })
    .then(loans => {
      res.send(loans);
    });
});

/** Create loan */
router.post('/loans', (req, res, next) => {
  models.Loan.create(req.body)
    .then(loan => loan.dataValues.id)
    .then(id => {
      return models.Loan.findById(id, {
        include: [
          {
            model: models.Patron,
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: models.Book,
            attributes: ['id', 'title', 'available']
          }
        ]
      })
    })
    .then(loan => {
      res.send(loan)
    })
    .catch(() => {
      res.sendStatus(403);
    })
});

/** Update loan */
router.put('/loans/:id', (req, res, next) => {
  let oldLoan;
  let newLoan;

  models.Loan.findById(req.params.id)
    .then(loan => {
      if (!loan) {
        throw new Error();
      }
      oldLoan = Object.assign({}, loan.dataValues);
      return loan.update(req.body);
    })
    .then(loan => {
      newLoan = Object.assign({}, loan.dataValues);
      /** check if loan book was returned */
      if (!oldLoan.returned_on && newLoan.returned_on) {
        /** return the book */
        loan.returnBook(newLoan);
      }
      /** check if loan doesn't returned and the book was changed */
      else if (!oldLoan.returned_on && !newLoan.returned_on) {
        if (oldLoan.book_id !== newLoan.book_id) {
          /** return the old book and borrow the new one */
          loan.returnBook(oldLoan);
          loan.borrowBook(newLoan);
        }
      }
      /** check if The book was borrowed */
      else if (oldLoan.returned_on && !newLoan.returned_on) {
        /** borrow the new book */
        loan.borrowBook(newLoan);
      }

      res.send(loan);
    })
    .catch(error => {
      res.sendStatus(403);        
    });
});

/** Delete loan */
router.delete('/loans/:id', (req, res, next) => {
  models.Loan.findById(req.params.id)
    .then(loan => {
      if (!loan) { 
        throw new Error();
      }
      return loan.destroy();
    })
    .then(loan => {
      res.send(loan);
    })
    .catch(() => {
      res.sendStatus(403);
    });
});

/**
 * Genres routes
 */

/** Get genres  */
router.get('/genres', (req, res, next) => {
  models.Genre.findAll()
    .then(genres => {
      res.send(genres);
    })
    .catch(() => {
      res.sendStatus(403);
    });
});

/** Create genre */
router.post('/genres', (req, res, next) => {
  models.Genre.create(req.body)
    .then(genre => {
      res.send(genre)
    })
    .catch(() => {
      res.sendStatus(403);
    });
});

/**
 * Authors routes
 */

/** Get authors  */
router.get('/authors', (req, res, next) => {
  models.Author.findAll()
    .then(authors => {
      res.send(authors);
    })
    .catch(() => {
      res.sendStatus(403);
    });
});

/** Create author */
router.post('/authors', (req, res, next) => {
  models.Author.create(req.body)
    .then(author => {
      res.send(author)
    })
    .catch(() => {
      res.sendStatus(403);
    });
});

module.exports = router;
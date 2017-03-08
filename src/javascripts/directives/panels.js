angular
  .module('slim')
  .directive('panels', panels);

panels.$inject = ['$timeout', 'Data', 'Dates', 'Noty', 'Tooltip'];

function panels($timeout, Data, Dates, Noty, Tooltip) {
  return {
    resstrict: 'E',
    templateUrl: 'templates/partials/panels',
    replace: true,
    scope: {
      panel: '=',
      authorsList: '=',
      genresList: '=',
      titlesList: '=',
      patronNamesList: '='
    },
    link(scope, element, attrs) {

      /**
       * Initial Data
       */

      scope.book.quantity = 0;
      scope.book.first_published = 1800;
      scope.loan.loaned_on = new Date();
      scope.loan.return_by = Dates.getTwoWeeks()

      /**
       * Reset Data
       */

      const controls = {
        book: {
          title: '',
          Author: '',
          Genre: '',
          first_published: 1800,
          quantity: 0
        },
        author: {
          fname: '',
          lname: ''
        },
        genre: {
          genre: ''
        },
        loan: {
          Book: '',
          Patron: '',
          loaned_on: new Date(),
          return_by: Dates.getTwoWeeks()
        },
        patron: {
          first_name: '',
          last_name: '',
          address: '',
          email: '',
          zip_code: ''
        }
      };

      /**
       * Forms Methods
       */

      scope.reset = (object, name) => {
        // reset obj properties
        angular.extend(object, controls[name]);
        object.form.$setPristine();
        // dispose tooltips
        Tooltip.array(object.form.tooltips, 'dispose');
      };

      scope.close = cat => {
        Tooltip.array(cat.form.tooltips, 'hide');
        cat.panel = false;
      };

      scope.open = cat => {
        cat.panel = true;
        if (cat.form.$submitted || cat.form.$dirty) {
          // wait for animation and show tooltips
          $timeout(() => {
            // If form submitted show all tooltips
            if (cat.form.$submitted) {
              Tooltip.array(cat.form.tooltips, 'show');
            }
            // If form not submitted show only dirty controls tooltips
            else {
              angular.forEach(cat.form.tooltips, tooltip => {
                if (!tooltip.pristine) {
                  Tooltip.show(tooltip.element);
                }
              });
            }
          }, 250);
        }
      };

      scope.createBook = () => {
        const book = scope.book;

        book.form.$setSubmitted();

        if (book.form.$valid) {
          const data = {
            title: book.title,
            author_id: book.Author.id,
            genre_id: book.Genre.id,
            first_published: book.first_published,
            quantity: book.quantity,
            available: book.quantity
          };
          Data.post(data, 'books')
            .then(() => {
              success(book, 'book');
            })
            .catch(() => {
              error('book');
            });
        }
        else {
          invalidForm(book);
        } 
      };

      scope.createAuthor = () => {
        const author = scope.author;

        author.form.$setSubmitted();

        if (author.form.$valid) {
          const data = {
            name: author.fname + ' ' + author.lname
          };
          Data.post(data, 'authors')
            .then(() => {
              success(author, 'author');
            })
            .catch(() => {
              error('author');
            });
        }
        else {
          invalidForm(author);
        } 
      };

      scope.createGenre = () => {
        const genre = scope.genre;

        genre.form.$setSubmitted();

        if (genre.form.$valid) {
          const data = {
            genre: genre.genre
          };
          Data.post(data, 'genres')
            .then(() => {
              success(genre, 'genre');
            })
            .catch(() => {
              error('genre');
            });
        }
        else {
          invalidForm(genre);
        } 
      };

      scope.createLoan = () => {
        const loan = scope.loan;

        loan.form.$setSubmitted();

        if (loan.form.$valid) {
          const data = {
            book_id: loan.Book.id,
            patron_id: loan.Patron.id,
            loaned_on: Dates.datePostFormat(loan.loaned_on),
            return_by: Dates.datePostFormat(loan.return_by)
          };
          Data.post(data, 'loans')
            .then(() => {
              success(loan, 'loan');
            })
            .catch(() => {
              error('loan');
            });
        }
        else {
          invalidForm(loan);
        }
      };

      scope.createPatron = () => {
        const patron = scope.patron;

        patron.form.$setSubmitted();

        if (patron.form.$valid) {
          const data = {
            first_name: patron.first_name,
            last_name: patron.last_name,
            address: patron.address,
            email: patron.email,
            zip_code: patron.zip_code
          };
          Data.post(data, 'patrons')
            .then(() => {
              success(patron, 'patron');
            })
            .catch(() => {
              error('patron');
            });
        }
        else {
          invalidForm(patron);
        }
      };

      // Group books by availablity
      scope.getAvailableStatus = book => book.available > 0 ? 'Available' : 'Unavailable';

      /**
       * Helpers function
       */

      function success(categoty, name) {
        // display success message
        Noty.displayNotes(`New ${name} was created`, 'success', 'topRight');
        // close the panel
        scope.close(categoty);
        // reset the form
        scope.reset(categoty, name);
      }

      function error(name) {
        // display error message
        Noty.displayNotes(`<strong>API error</strong><br> can\'t create new ${name}`, 'error', 'topRight');
      }

      function invalidForm(category) {
        // show all tooltips
        Tooltip.array(category.form.tooltips, 'show');
        // display warning message
        Noty.displayNotes('Please check the form and try again', 'warning', 'topRight');
      }
    }
  }
}
angular
  .module('slim')
  .service('Api', Api);
  
Api.$inject = ['$http']

function Api($http) {
  const config = {
    timeout: 90000
  }

  /**
   * Books routes
   */

  this.getBooks = () => $http.get('/api/books', config);

  this.postBook = data => $http.post('/api/books', data);

  this.putBook = (id, data) => $http.put(`/api/books/${id}`, data);

  this.deleteBook = id => $http.delete(`/api/books/${id}`);

  this.getTitles = () => $http.get('/api/books?titles=all');

  /**
   * Patrons routes
   */

  this.getPatrons = () => $http.get('/api/patrons', config);

  this.postPatron = data => $http.post('/api/patrons', data);

  this.putPatron = (id, data) => $http.put(`/api/patrons/${id}`, data);

  this.deletePatron = id => $http.delete(`/api/patrons/${id}`);

  this.getPatronNames = () => $http.get('/api/patrons?names=all');

  /**
   * Loans routes
   */

  this.getLoans = () => $http.get('/api/loans', config);

  this.postLoan = data => $http.post('/api/loans', data);

  this.putLoan = (id, data) => $http.put(`/api/loans/${id}`, data);

  this.deleteLoan = id => $http.delete(`/api/loans/${id}`);

  /**
   * Genres routes
   */

  this.getGenres = () => $http.get('/api/genres');

  this.postGenre = data => $http.post('/api/genres', data);

  /**
   * Authors routes
   */

  this.getAuthors = () => $http.get('/api/authors');

  this.postAuthor = data => $http.post('/api/authors', data);
};
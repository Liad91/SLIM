angular
  .module('slim')
  .service('Api', Api);
  
Api.$inject = ['$http']

function Api($http) {
  const self = this;
  const config = {
    timeout: 90000
  }

  /**
   * Books routes
   */

  self.getBooks = function() {
    return $http.get('/api/books', config);
  };

  self.postBook = function(data) {
    return $http.post('/api/books', data);
  };

  self.putBook = function(id, data) {
    return $http.put('/api/books/' + id, data);
  };

  self.deleteBook = function(id) {
    return $http.delete('/api/books/' + id);
  };

  self.getTitles = function() {
    return $http.get('/api/books?titles=all');
  };

  /**
   * Patrons routes
   */

  self.getPatrons = function() {
    return $http.get('/api/patrons', config);
  };

  self.postPatron = function(data) {
    return $http.post('/api/patrons', data);
  };

  self.putPatron = function(id, data) {
    return $http.put('/api/patrons/' + id, data);
  };

  self.deletePatron = function(id) {
    return $http.delete('/api/patrons/' + id);
  };

  self.getPatronNames = function() {
    return $http.get('/api/patrons?names=all');
  };

  /**
   * Loans routes
   */

  self.getLoans = function() {
    return $http.get('/api/loans', config);
  };

  self.postLoan = function(data) {
    return $http.post('/api/loans', data);
  };

  self.putLoan = function(id, data) {
    return $http.put('/api/loans/' + id, data);
  };

  self.deleteLoan = function(id) {
    return $http.delete('/api/loans/' + id);
  };

  /**
   * Genres routes
   */

  self.getGenres = function() {
    return $http.get('/api/genres');
  };

  self.postGenre = function(data) {
    return $http.post('/api/genres', data);
  };

  /**
   * Authors routes
   */

  self.getAuthors = function() {
    return $http.get('/api/authors');
  };

  self.postAuthor = function(data) {
    return $http.post('/api/authors', data);
  };
};
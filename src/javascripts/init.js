angular
  .module('slim')
  .run(init);

init.$inject = ['Api', 'Data'];

function init(Api, Data) {

  Data.set([
    {
      name: 'books',
      get: Api.getBooks(),
      post: Api.postBook,
      put: Api.putBook,
      del: Api.deleteBook
    },
    {
      name: 'titles',
      get: Api.getTitles()      
    },
    {
      name: 'genres',
      get:  Api.getGenres(),
      post: Api.postGenre
    },
    {
      name: 'authors',
      get: Api.getAuthors(),
      post: Api.postAuthor
    },
    {
      name: 'patronNames',
      get: Api.getPatronNames()      
    },
    {
      name: 'loans',
      get: Api.getLoans(),
      post: Api.postLoan,
      put: Api.putLoan,
      del: Api.deleteLoan
    },
    {
      name: 'patrons',
      get: Api.getPatrons(), 
      post: Api.postPatron,
      put: Api.putPatron,
      del: Api.deletePatron
    }
  ]);
}
angular
  .module('slim')
  .run(initial);

initial.$inject = ['Api', 'Data'];

function initial(Api, Data) {
  Data.set([
    {
      promise: Api.getBooks(),
      category: 'books',
      post: Api.postBook,
      put: Api.putBook,
      del: Api.deleteBook
    },
    {
      promise: Api.getTitles(),
      category: 'titles'
    },
    {
      promise:  Api.getGenres(),
      category: 'genres',
      post: Api.postGenre
    },
    {
      promise: Api.getAuthors(),
      category: 'authors',
      post: Api.postAuthor
    },
    {
      promise: Api.getPatronNames(),
      category: 'patronNames'
    },
    {
      promise: Api.getLoans(),
      category: 'loans',
      post: Api.postLoan,
      put: Api.putLoan,
      del: Api.deleteLoan
    },
    {
      promise: Api.getPatrons(),
      category: 'patrons',
      post: Api.postPatron,
      put: Api.putPatron,
      del: Api.deletePatron
    }
  ]);
}
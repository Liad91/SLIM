angular
  .module('slim')
  .config(routes);

routes.$inject = ['$routeProvider', '$locationProvider'];

function routes($routeProvider, $locationProvider) {
  clearCookie.$inject = ['$cookies', '$window'];
  clearServices.$inject = ['Noty'];

  function clearCookie($cookies, $window) {
    $cookies.remove('slimAdministrator');
    $window.location.reload()
  }

  function clearServices(Noty) {
    Noty.closeAll();
  }

  $routeProvider
    .when('/books', {
      controller: 'BooksCtrl',
      controllerAs: 'vm',
      templateUrl: 'templates/pages/books',
      resolve: {
        clearServices
      }
    })

    .when('/patrons', {
      controller: 'PatronsCtrl',
      controllerAs: 'vm',
      templateUrl: 'templates/pages/patrons',
      resolve: {
        clearServices
      }
    })

    .when('/loans', {
      controller: 'LoansCtrl',
      controllerAs: 'vm',
      templateUrl: 'templates/pages/loans',
      resolve: {
        clearServices
      }
    })

    .when('/logout', {
      resolve: {
        clearCookie
      }
    })

    .otherwise({
      redirectTo: '/books'
    });

  /** Removing the "#" from the url */
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
};
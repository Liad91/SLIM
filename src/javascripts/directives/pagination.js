angular
  .module('slim')
  .directive('pagination', pagination);

pagination.$inject = ['Settings'];

function pagination(Settings) {
  return {
    resstrict: 'E',
    templateUrl: 'templates/partials/pagination',
    scope: {
      list: '=',
      currentPage: '=',
      setPage: '=',
    },
    replace: true,
    link: function(scope, element, attrs) {
      Settings.get(scope, 'global');
      scope.nav = [];

      scope.setNav = function() {
        const totalItems = scope.list.length;
        const itemsPerPage = scope.itemsPerPage;
        const paginationLength = scope.paginationLength;

        scope.totalPages = Math.ceil(totalItems / itemsPerPage);

        let nav = [];
        let start;
        let end;

        // If less pages than paginationLength show all
        if (scope.totalPages <= paginationLength) {
          start = 1;
          end = scope.totalPages;
        }
        // More pages than paginationLength calculate start and end pages
        else {
          if (scope.currentPage <= (Math.ceil(paginationLength / 2))) {
            start = 1;
            end = paginationLength;
          }
          else if (scope.currentPage + (Math.floor(paginationLength / 2)) >= scope.totalPages) {
            start = scope.totalPages - (paginationLength - 1);
            end = scope.totalPages;
          }
          else {
            start = scope.currentPage - (Math.floor(paginationLength / 2));
            end = scope.currentPage + (Math.floor(paginationLength / 2));
          }
        }

        for(let i = start; i <= end; i++) {
          nav.push(i);
        }
        scope.nav = nav;
      };

      scope.navigate = function(page) {
        if (scope.setPage(page)) {
          scope.currentPage = page;

          if (scope.totalPages > scope.paginationLength) {
            scope.setNav();
          }
        }
      };

      scope.$watchCollection('list', function(list) {
        scope.setNav();
      });
    }
  }
}
angular
  .module('slim')
  .directive('pagination', pagination);
  
function pagination() {
  return {
    resstrict: 'E',
    templateUrl: 'templates/partials/pagination',
    scope: {
      nav: '=',
      totalPages: '=',
      length: '=',
      currentPage: '=',
      setPage: '&'
    },
    replace: true
  };
}
angular
  .module('slim')
  .directive('pagination', pagination);
  
function pagination() {
  return {
    resstrict: 'E',
    templateUrl: 'templates/partials/pagination',
    scope: {
      state: '=',
      nav: '=',
      totalPages: '=',
      setItemsPerPage: '&',
      setPaginationLength: '&',
      setPage: '&'
    },
    replace: true
  };
}
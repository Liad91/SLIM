angular
  .module('slim')
  .service('State', State);

function State() {

  const service = {
    get
  }

  return service;

  function get(scope, category) {
    if (!service[category]) {
      service[category] = {
        currentPage: 1,
        editItemIndex: null,
        itemsPerPage: 5,
        paginationLength: 5,
        currentFilter: 'All',
        searchQuery : '',
        sortBy: null,
        sortReverse: false
      }
    }
    scope.state = service[category];
  }
}

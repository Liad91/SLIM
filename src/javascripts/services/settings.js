angular
  .module('slim')
  .service('Settings', Settings);

function Settings() {

  const service = {
    get: get,
    set: set,
    global: {
      itemsPerPage: 5,
      paginationLength: 5
    },
    books: {
      itemInEditIndex: '',
      currentPage: 1,
      searchQuery: '',
      orderBy: '',
      reverse: false
    },
    patrons: {
      itemInEditIndex: '',
      currentPage: 1,
      orderBy: '',
      reverse: false
    },
    loans: {
      itemInEditIndex: '',
      currentPage: 1,
      orderBy: '',
      reverse: false
    }
  }

  return service;

  function set(category, key, value) {
    return service[category][key] = value;
  }

  function get(scope, category) {
    angular.forEach(service[category], function(value, key) {
      scope[key] = service[category][key];
    });
  }
}

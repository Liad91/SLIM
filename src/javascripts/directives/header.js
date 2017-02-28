angular
  .module('slim')
  .directive('topHeader', topHeader);

function topHeader() {
  return {
    resstrict: 'E',
    templateUrl: 'templates/partials/header',
    scope: {
      title: '=',
      currentFilter: '=',
      filters: '=',
      switchFilter: '=',
      searchFilter: '=',
      searchQuery : '=',
      panel: '='
    },
    replace: true
  }
}
angular
  .module('slim')
  .directive('navigation', navigation);

navigation.$inject = ['State']

function navigation(State) {
  return {
    restrict: 'E',
    templateUrl: 'templates/partials/navigation',
    scope: {
      title: '=',
      panel: '=',
      category: '=',
      filterList: '=',
      switchFilter: '&',
      changeable: '&',
      search: '&',
      adjust: '&'
    },
    replace: true,
    link(scope, element, attrs) {

      scope.$watch('category', () => {
        State.get(scope, scope.category);
        scope.itemsPerPage = scope.state.itemsPerPage.toString();
        scope.paginationLength = scope.state.paginationLength.toString();
      });

      scope.setItemsPerPage = () => {
        if (scope.changeable()) {
          scope.state.itemsPerPage = parseInt(scope.itemsPerPage);
          scope.adjust({force: true});
        }
        else {
          scope.itemsPerPage = scope.state.itemsPerPage.toString();
        }
      }

      scope.setPaginationLength = () => {
        if (scope.changeable()) {
          scope.state.paginationLength = parseInt(scope.paginationLength);
          scope.adjust({force: true});
        }
        else {
          scope.paginationLength = scope.state.paginationLength.toString();
        }
      }
    }
  }
}
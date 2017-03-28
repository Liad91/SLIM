angular
  .module('slim')
  .directive('navigation', navigation);

navigation.$inject = ['State']

function navigation(State) {
  return {
    restrict: 'E',
    templateUrl: 'templates/partials/navigation',
    scope: {
      miniSidebar: '=',
      title: '=',
      panel: '=',
      category: '=',
      search: '&',
    },
    replace: true,
    link(scope, element, attrs) {
      scope.$watch('category', () => {
        State.get(scope, scope.category);
      });
    }
  }
}
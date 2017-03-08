angular
  .module('slim')
  .service('Broadcast', Broadcast);

Broadcast.$inject = ['$rootScope'];

function Broadcast($rootScope) {
  this.set = (msg, data) => {
    $rootScope.$emit(msg, data);
  };

  this.get = (scope, msg, cb) => {
    const handler = $rootScope.$on(msg, cb);

    scope.$on('$destroy', handler);
  };
}
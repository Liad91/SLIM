angular
  .module('slim')
  .service('Broadcast', Broadcast);

Broadcast.$inject = ['$rootScope'];

function Broadcast($rootScope) {
  var self = this;

  self.set = function(msg, data) {
    $rootScope.$emit(msg, data);
  };

  self.get = function(scope, msg, cb) {
    var handler = $rootScope.$on(msg, cb);
    scope.$on('$destroy', handler);
  };
}
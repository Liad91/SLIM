angular
  .module('slim')
  .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope','$location', 'Data' ,'Broadcast'];
  
  function MainCtrl($scope, $location, Data, Broadcast) {

    const vm = this;

    vm.getUrl = function() {
      return $location.url().split('/')[1];
    };
      
    /**
     * Data watchers
     */

    const services = ['titles', 'genres', 'authors', 'patronNames'];

    Data.subscribe(vm, services);

    $scope.$on('$destroy', function() {
      Data.unsubscribe(vm, services);
    });

    Broadcast.get($scope, 'header-data', function(event, data) {
      vm.header = data;
    })
  };
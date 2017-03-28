angular
  .module('slim')
  .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope','$location', 'Data', 'Broadcast'];
  
  function MainCtrl($scope, $location, Data, Broadcast) {

    const vm = this;

    vm.getUrl = () => $location.url().split('/')[1];
      
    /**
     * Data watchers
     */

    const categories = ['titles', 'genres', 'authors', 'patronNames'];

    Data.watch(vm, categories);

    Broadcast.get($scope, 'navigation', (event, data) => {
      vm.nav = data;
      vm.nav.category = vm.getUrl();
    });
  };
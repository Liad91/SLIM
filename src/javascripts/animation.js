angular
  .module('slim')
  .config(animation);

animation.$inject = ['$animateProvider'];

function animation($animateProvider) {
  $animateProvider.classNameFilter(/angular-animate/);
}
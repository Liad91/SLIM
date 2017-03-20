angular
  .module('slim')
  .directive('letters', letters);

function letters() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link(scope, element, attrs, ctrl) {
      ctrl.$validators.letters = modelValue => {
        if (modelValue) {
          return modelValue.search(/^[a-zA-Z']*$/) ? false : true;
        }
      };
    }
  }
}
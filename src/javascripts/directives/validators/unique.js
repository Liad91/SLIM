angular
  .module('slim')
  .directive('unique', unique);

function unique() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      list: '='
    },
    link(scope, element, attrs, ctrl) {
      element.ready(() => {
        const name = attrs.name;

        /* Set uniqueValidator if scope.list array not empty **/
        scope.$watch('list', list => {
          if(list.length > 1) {
            uniqueValidator();
            ctrl.$validate('unique');
          }
        }, true);
        
        function uniqueValidator() {
          let value = '';
          let values;

          if (name === 'title') {
            values = scope.list.map(book => book.title.toLowerCase());
          }
          else {
            values = scope.list.map(genre => genre.genre.toLowerCase());
          }
          
          /* Set value from modelValue if the ctrl is pristine and have a modelValue **/
          if (ctrl.$modelValue && ctrl.$pristine) {
            value = ctrl.$modelValue.toLowerCase();
          }

          const index = values.indexOf(value);
          /* Remove value from values array (for editing) **/
          if (index > -1) {
            values.splice(index, 1);
          }

          ctrl.$validators.unique = modelValue => {
            if (modelValue) {
              return values.indexOf(modelValue.toLowerCase()) > -1 ? false : true;
            }
          };
        } 
      });
    }
  }
}
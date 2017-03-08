angular
  .module('slim')
  .directive('authorValidator', authorValidator);

authorValidator.$inject = ['Tooltip'];

function authorValidator(Tooltip) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link(scope, element, attrs, ctrl) {
      const input = attrs.name;
      // Define empty tooltips array in the form object
      const form = ctrl.$$parentForm;
      form.tooltips = [];

      ctrl.$validators.letters = modelValue => {
        if (modelValue) {
          const regex = /^[a-zA-Z']*$/;

          return modelValue.search(regex) ? false : true;
        }
      };

      function getErrorObject() {
        return ctrl.$error;
      }
      
      function validate() {
        if (ctrl.$invalid) {
          let title = '';

          if (input === 'fname') {
            if (ctrl.$error.required) {
              title = 'First name is required';
            }
            else if (ctrl.$error.letters) {
              title = 'First name can contain letters only';
            }
          }
          else if (input === 'lname') {
            if (ctrl.$error.required) {
              title = 'Last name is required';
            }
            else if (ctrl.$error.letters) {
              title = 'Last name can contain letters only';
            }
          }
          // Create tooltip if not exists
          if (!element.attr('data-original-title')) {
            element.attr('data-original-title', title);
            Tooltip.create(element);
            // push the element into the form.tooltips array
            form.tooltips.push({
              input,
              element,
              pristine: ctrl.$pristine
            });
            // show only if the field is dirty (changed)
            if (ctrl.$dirty) {
              Tooltip.show(element);
            }
          }
          // Change title for exists tooltip 
          else {
            element.attr('data-original-title', title);
            Tooltip.show(element);
          }
        }
        else {
          // Dispose tooltip if exists and remove it from form.tooltips array
          if(element.attr('data-original-title')) {
            angular.forEach(form.tooltips, (tooltip, index) => {
              if (tooltip.input === input) {
                form.tooltips.splice(index, 1);
                Tooltip.dispose(element);
              }
            });
          }
        }
      }
      /** Watch the ctrl.$error and validate the form */
      scope.$watch(getErrorObject, validate, true);
    }
  }
}
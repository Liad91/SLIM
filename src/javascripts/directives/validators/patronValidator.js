angular
  .module('slim')
  .directive('patronValidator', patronValidator);

patronValidator.$inject = ['Tooltip'];

function patronValidator(Tooltip) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link(scope, element, attrs, ctrl) {
      const input = attrs.name;
      // Define empty tooltips array in the form object
      const form = ctrl.$$parentForm;
      form.tooltips = [];

      if (input === 'fname' || input === 'lname') {
        ctrl.$validators.letters = modelValue => {
          if (modelValue) {
            const regex = /^[a-zA-Z']*$/;

            return modelValue.search(regex) ? false : true;
          }
        };
      }

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
          else if (input === 'address') {
            if (ctrl.$error.required) {
              title = 'Address is required';
            }
          }
          else if (input === 'email') {
            if (ctrl.$error.required) {
              title = 'Email is required';
            }
            else if (ctrl.$error.email) {
              title = 'Invalid email address';
            }
          }
          else if (input === 'zip') {
            if (ctrl.$error.required) {
              title = 'Zip code is required';
            }
            else if (ctrl.$error.minlength) {
              title = `Zip code length have be at list ${attrs.ngMinlength} digits`;
            }
            else if (ctrl.$error.maxlength) {
              title = `Zip code length can\'t be more than ${attrs.ngMaxlength} digits`;
            }
            else if (ctrl.$error.number) {
              title = 'Invalid number';
            }
          }
          // Create tooltip if not exists
          if (!element.attr('data-original-title')) {
            element.attr('data-original-title', title);
            Tooltip.create(element);
            // push the element into the form.tooltips array
            form.tooltips.push({
              input: input,
              element: element,
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
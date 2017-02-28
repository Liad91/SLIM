angular
  .module('slim')
  .directive('loanValidator', loanValidator);

loanValidator.$inject = ['$compile', 'Tooltip', 'Dates'];

function loanValidator($compile, Tooltip, Dates) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      const input = attrs.name;
      // Define empty tooltips array in the form object
      const form = ctrl.$$parentForm;
      form.tooltips = [];

      /** Set 'max' and 'min' validators to return_by */
      function returnValidation() {
        // Get return_by element
        const returnElement = form.return_by.$$element;
        // Make copy of form.tooltips array
        const tooltips = form.tooltips;

        // Remove validators if loaned_on value is not a date object
        if (!angular.isDate(ctrl.$modelValue)) {
          // Remove the return_by 'min' and 'max' attr
          returnElement.removeAttr('max');
          returnElement.removeAttr('min');

          // Compile the element
          $compile(returnElement)(scope);
          angular.extend(form.tooltips, tooltips);
          return;
        }
        
        // Get the date object
        const date = ctrl.$modelValue;
        // Set the required date for return_by max attr
        const max = Dates.datePostFormat(Dates.getNextYear(date));
        const min = Dates.datePostFormat(Dates.getTomorrow(date));

        // Set the return_by 'min' and 'max' attr
        returnElement.attr('max', max);
        returnElement.attr('min', min);

        // Compile the element
        $compile(returnElement)(scope);
        // Retrieve the form.tooltips array
        angular.extend(form.tooltips, tooltips);
      }

      /** Form validation function */
      function validate() {
        if (ctrl.$invalid) {
          let title = '';

          // Set the tooltip title
          if (input === 'book') {
            title = 'Book is required';
          }
          else if (input === 'patron') {
            title = 'Patron is required';
          }
          else if (input === 'loaned_on') {
            if (ctrl.$error.date) {
              title = 'Loaned on date is invalid';
            }
            else if (ctrl.$error.required) {
              title = 'Loaned on date is required';
            }
            else if (ctrl.$error.min) {
              title = 'The earliest date loaned on can be is January 2000';
            }
            else if (ctrl.$error.max) {
              title = 'The latest date Loaned on can be is today\'s';
            }
          }
          else if (input === 'return_by') {
            if (ctrl.$error.date) {
              title = 'Return by date is invalid';
            }
            else if (ctrl.$error.required) {
              title = 'Return by date is required';
            }
            else if (ctrl.$error.min) {
              title = 'The earliest date return by can be is loaned on date';
            }
            else if (ctrl.$error.max) {
              title = 'The latest date return by can be is one year from loaned on';
            }
          }
          
          // Create tooltip if not exists
          if (!element.attr('data-original-title')) {
            element.attr('data-original-title', title);
            Tooltip.create(element);
            // Push the element into the form.tooltips array
            form.tooltips.push({
              input: input,
              element: element,
              pristine: ctrl.$pristine
            });
            // Show only if the field is dirty (touched)
            if (ctrl.$dirty) {
              Tooltip.show(element);
            }
            // Show if return_by has changed and effect loaned_on
            if (input === 'return_by' && ctrl.$pristine) {
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
            angular.forEach(form.tooltips, function(tooltip, index) {
              if (tooltip.input === input) {
                form.tooltips.splice(index, 1);
                Tooltip.dispose(element);
              }
            });         
          }
        }
      }

      function getErrorObject() {
        return ctrl.$error;
      }

      // Listen to changes in loaned_on and render the return_by element
      if (attrs.name === 'loaned_on') {
        // Run the function when the element is ready
        element.ready(returnValidation);
        // Push the function to $viewChangeListeners
        ctrl.$viewChangeListeners.push(returnValidation);
      }

      /** Watch the ctrl.$error and validate the form */
      scope.$watch(getErrorObject, validate, true);
    }
  }
}
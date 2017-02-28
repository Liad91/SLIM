angular
  .module('slim')
  .directive('bookValidator', bookValidator);

bookValidator.$inject = ['$compile', 'Tooltip'];

function bookValidator($compile, Tooltip) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      titles: '='
    },
    link: function(scope, element, attrs, ctrl) {
      const input = attrs.name;
      // Define empty tooltips array in the form object
      const form = ctrl.$$parentForm;
      form.tooltips = [];

      element.ready(function() {
        // set min validator to quantity
        if (input === 'quantity' && !attrs.min) {
          // Make copy of form.tooltips array
          const tooltips = angular.extend({}, form.tooltips);
          
          // check if there is a available input in the form
          if (ctrl.$$parentForm.available) {
            const available = ctrl.$$parentForm.available.$modelValue;
            const quantity = ctrl.$modelValue;
            const min = quantity - available;
            
            element.attr('min', min);
            $compile(element)(scope.$parent);
          }
          angular.extend(form.tooltips, tooltips)
        }

        if (input === 'title') {

          // set watcher for scope.titles array
          scope.$watch('titles', function(titles) {
            // set uniqueValidator if scope.titles array not empty
            if(titles.length > 1) {
              uniqueValidator();
              ctrl.$validate('unique');
            }
          }, true);
          
          function uniqueValidator() {
            let title = '';
            const titlesList = scope.titles;
            const titles = titlesList.map(function(title) {
              return title.title.toLowerCase();
            })

            // set title from modelValue if the ctrl is pristine and have a modelValue
            if (ctrl.$modelValue && ctrl.$pristine) {
              title = ctrl.$modelValue.toLowerCase();
            }

            const index = titles.indexOf(title);

            // remove title from titles array (for editing)
            if (index > -1) {
              titles.splice(index, 1);
            }

            ctrl.$validators.unique = function(modelValue, viewValue) {
              if (modelValue) {
                const title = modelValue.toLowerCase();
                if (titles.indexOf(title) > -1) {
                  return false;
                }
                return true;
              }
            };
          } 
        }
      });

      function getErrorObject() {
        return ctrl.$error;
      }

      function validate() {
        if (ctrl.$invalid) {
          let title = '';

          if (input === 'title') {
            if (ctrl.$error.required) {
              title = 'Title is required';
            }
            else if (ctrl.$error.unique) {
              title = 'Title should be unique';
            }
          }
          else if (input === 'author') {
            if (ctrl.$error.required) {
              title = 'Author is required';
            }
          }
          else if (input === 'genre') {
            if (ctrl.$error.required) {
              title = 'Genre is required';
            }
          }
          else if (input === 'published') {
            if (ctrl.$error.required) {
              title = 'First published is required';
            }
            else if (ctrl.$error.min) {
              title = 'The earliest year first published can be is 1800';
            }
            else if (ctrl.$error.max) {
              title = 'The latest year first published can be is this year';
            }
            else if (ctrl.$error.number) {
              title = 'Invalid number';
            }
          }
          else if (input === 'quantity') {
            if (ctrl.$error.required) {
              title = 'Quantity is required';
            }
            else if (ctrl.$error.min) {
              title = `Quantity can\'t be lower than ${attrs.min}`;
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
            if (ctrl.$dirty) {
              Tooltip.show(element);
            }
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
      /** Watch the ctrl.$error and validate the form */
      scope.$watch(getErrorObject, validate, true);
    }
  }
}
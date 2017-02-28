angular
  .module('slim')
  .directive('genreValidator', genreValidator);

genreValidator.$inject = ['Tooltip'];

function genreValidator(Tooltip) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      genres: '='
    },
    link: function(scope, element, attrs, ctrl) {
      // Define empty tooltips array in the form object
      const form = ctrl.$$parentForm;
      form.tooltips = [];

      element.ready(function() {
        // set watcher for scope.genres array
        scope.$watch('genres', function(genres) {
          // set uniqueValidator if scope.genres array not empty
          if(genres.length > 1) {
            uniqueValidator();
            ctrl.$validate();
          }
        }, true);

        function uniqueValidator() {
          let genre = '';
          const genresList = scope.genres;
          const genres = genresList.map(function(genre) {
            return genre.genre.toLowerCase();
          })

          // set genre from modelValue if the ctrl is pristine and have a modelValue
          if (ctrl.$modelValue && ctrl.$pristine) {
            genre = ctrl.$modelValue.toLowerCase();
          }

          const index = genres.indexOf(genre);

          // remove genre from genres array (for editing)
          if (index > -1) {
            genres.splice(index, 1);
          }

          ctrl.$validators.unique = function(modelValue, viewValue) {
            if (modelValue) {
              const genre = modelValue.toLowerCase();
              if (genres.indexOf(genre) > -1) {
                return false;
              }
              return true;
            }
          };
        }
      });

      function getErrorObject() {
        return ctrl.$error;
      }
      
      function validate() {
        if (ctrl.$invalid) {
          let title = '';

          if (ctrl.$error.required) {
            title = 'Genre is required';
          }
          else if (ctrl.$error.unique) {
            title = 'Genre should be unique';
          }
          // Create tooltip if not exists
          if (!element.attr('data-original-title')) {
            element.attr('data-original-title', title);
            Tooltip.create(element);
            // push the element into the form.tooltips array
            form.tooltips.push({
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
          // Dispose tooltip if exists and remove it from form.tooltip property
          if(element.attr('data-original-title')) {
            form.tooltips = [];
            Tooltip.dispose(element);
          }
        }
      }
      /** Watch the ctrl.$error and validate the form */
      scope.$watch(getErrorObject, validate, true);
    }
  }
}
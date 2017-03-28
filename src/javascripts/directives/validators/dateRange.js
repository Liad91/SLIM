angular
  .module('slim')
  .directive('dateRange', dateRange);

dateRange.$inject = ['$compile', 'Dates'];

function dateRange($compile, Dates) {
  return {
    restrict: 'A',
    require: '^form',
    link(scope, element, attrs, ctrl) {
      const clearWatch = scope.$watch(() => ctrl.loaned_on.$modelValue, (newVal, oldVal) => {
        if (newVal !== oldVal || !attrs.min) {
          /** Clear the previous watch */
          clearWatch();

          /** Remove validators if loaned_on value is not a date object */
          if (!angular.isDate(newVal)) {
            /** Remove the return_by 'min' and 'max' attr */
            element.removeAttr('max');
            element.removeAttr('min');

            /** Compile the element */
            return $compile(element)(scope);
          }

          const max = Dates.datePostFormat(Dates.getNextYear(newVal));
          const min = Dates.datePostFormat(Dates.getTomorrow(newVal));

          /** Get the two weeks date from newVal */
          const val = Dates.datePostFormat(Dates.getTwoWeeks(newVal));

          /** Set the return_by 'min' and 'max' attr */
          element.attr('max', max);
          element.attr('min', min);

          /** Remove the previous return_by control */
          ctrl.$removeControl(ctrl.return_by);

          /** Compile the return_by control */
          $compile(element)(scope);
          
          /** Only in options panel */
          if (!ctrl.returned_on) {
            /** Set the view value */
            ctrl.return_by.$setViewValue(val);
          }
        }
      });
    }
  }
}
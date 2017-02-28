angular
  .module('slim')
  .service('Dates', Dates);

Dates.$inject = ['$filter'];

function Dates($filter) {
  const self = this;

  /** Get tomorrow date */
  self.getTomorrow = function(day) {
    const date = angular.copy(day) || new Date();
    date.setDate(date.getDate() + 1);

    return date;
  };

  /** Get 1 year + 1 day from date */
  self.getNextYear = function(year) {
    const date = angular.copy(year);
    date.setDate(date.getDate() + 366);

    return date;
  };

  /** Get 2 weeks from today date */
  self.getTwoWeeks = function() {
    const date = new Date();
    date.setDate(date.getDate() + 14);

    return date;
  };

  self.getCurrentYear = function() {
    let date = new Date();
    date = date.getFullYear();

    return date;
  };
    
  /** Format the date for display "dd/MM/yyyy" */
  self.dateDisplayFormat = function(date) {
    if (!angular.isDate(date)) {
      return;
    }
    return $filter('date')(date, 'MM/dd/yyyy');
  };

  /** Format the date for database "yyyy-MM-dd" */
  self.datePostFormat = function(date) {
    if (!angular.isDate(date)) {
      return;
    }
    return $filter('date')(date, 'yyyy-MM-dd');
  };
};
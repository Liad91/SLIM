angular
  .module('slim')
  .service('Dates', Dates);

Dates.$inject = ['$filter'];

function Dates($filter) {
  /** Get the next day of given date */
  this.getTomorrow = day => {
    const date = angular.copy(day) || new Date();
    date.setDate(date.getDate() + 1);

    return date;
  };

  /** Get 1 year + 1 day from given date */
  this.getNextYear = year => {
    const date = angular.copy(year);
    date.setDate(date.getDate() + 366);

    return date;
  };

  /** Get 2 weeks from given date */
  this.getTwoWeeks = day => {
    const date = angular.copy(day);
    date.setDate(date.getDate() + 14);

    return date;
  };

  this.getCurrentYear = () => {
    let date = new Date();
    date = date.getFullYear();

    return date;
  };
    
  /** Format the date for display "dd/MM/yyyy" */
  this.dateDisplayFormat = date => !angular.isDate(date) ? '' : $filter('date')(date, 'MM/dd/yyyy');

  /** Format the date for database "yyyy-MM-dd" */
  this.datePostFormat = date => !angular.isDate(date) ? '' : $filter('date')(date, 'yyyy-MM-dd');
};
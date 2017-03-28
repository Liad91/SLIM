angular
  .module('slim')
  .filter('returned', returned);

function returned() {
  return (loans, returned) => loans.filter(loan => Boolean(loan.returned_on) === returned);
}
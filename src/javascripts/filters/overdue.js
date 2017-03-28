angular
  .module('slim')
  .filter('overdue', overdue);

function overdue() {
  return loans => loans.filter(loan => {
    if (!loan.returned_on && loan.return_by < new Date()) {
      return loan;
    }
  });
}
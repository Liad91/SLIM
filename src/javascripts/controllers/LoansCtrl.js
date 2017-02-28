angular
  .module('slim')
  .controller('LoansCtrl', LoansCtrl);

LoansCtrl.$inject = ['$scope', 'Data', 'Broadcast', 'Dates', 'Noty', 'Tooltip'];

function LoansCtrl($scope, Data, Broadcast, Dates, Noty, Tooltip) {

  const vm = this;

  /** 
   * Get Table Data
   */

  const services = ['loans', 'titles', 'patronNames'];

  Data.subscribe(vm, services);

  $scope.$on('$destroy', function() {
    Data.unsubscribe(vm, services);
  });
  
  /**
   * Set Table Filters
   */
    
  vm.filters = [
    { name: 'All', icon: 'fa-th-large' },
    { name: 'Overdue', icon: 'fa-clock-o' }
  ];

  vm.currentFilter = vm.filters[0].name;

  vm.switchFilter = function(filter) {  
    vm.currentFilter = filter;
  };

  vm.getAvailableStatus = function(book) {
    if (book.available > 0) {
      return 'Available';
    }
    return 'Unavailable';
  };

  /** 
   * Emit header data to MainCtrl
   */

  Broadcast.set('header-data', {
    title: 'Loans',
    currentFilter: vm.currentFilter,
    filters: vm.filters,
    switchFilter: vm.switchFilter
  });

  /**
   * Dates Handlers
   */

  /** Get tomorrow date */
  vm.getTomorrow = Dates.getTomorrow;

  /** Format the date for display "dd/MM/yyyy" */
  vm.dateDisplayFormat = Dates.dateDisplayFormat;

  /** Format the date for database "yyyy-MM-dd" */
  vm.datePostFormat = Dates.datePostFormat;
  
  /** 
   * Table Functions
   */

  /** Edit loan */
  vm.edit = function(loan) {
    // make sure that the the function will run only if another loan is on edit mode
    if (vm.loanInEditeMode) {
      return;
    }
    vm.loanInEditeMode = true;
    // make a copy of loan controls in loan.cache if the loan wasn't changed
    if (!loan.changed) {
      loan.cache = angular.extend({}, loan);
    }
    loan.editMode = true;
  };

  /** exit from edit mode without saving the changes */
  vm.cancel = function(loan) {
    // dispose tooltips if exist
    Tooltip.array(loan.form.tooltips, 'dispose');
    // retrieve loan from loan.cache
    angular.extend(loan, loan.cache);
    // clear loan.cache object
    loan.cache = {};
    loan.changed = false;
    // exit from edit mode
    loan.editMode = false;
    // exit loanInEditeMode
    vm.loanInEditeMode = false;
  };

  /** Save changes in database */
  vm.save = function(loan) {
    if (loan.form.$dirty || loan.changed) {
      loan.form.$setSubmitted();
      if (loan.form.$valid) {
        const data = {
          book_id: loan.Book.id,
          patron_id: loan.Patron.id,
          loaned_on: vm.datePostFormat(loan.loaned_on),
          return_by: vm.datePostFormat(loan.return_by)
        }
        // if loan.returned_on not exists save it as null
        data.returned_on = loan.returned_on ? vm.datePostFormat(loan.returned_on) : null;
        // Set adjust to true if book id changed (will cause to update of book availablity)
        const adjust = loan.cache.Book && data.book_id !== loan.cache.Book.id ? loan.cache.Book.id : false;

        Data.put(loan.id, data, 'loans' ,adjust)
          .then(function() {
            loan.editMode = false;
            // exit loanInEditeMode
            vm.loanInEditeMode = false;
            Noty.displayNotes(`Loan ${loan.id} was updated`, 'success');
            // clear loan.cache object
            loan.cache = {};
            loan.changed = false;
          })
          .catch(function(error) {
            console.log(error);
            Noty.displayNotes('<strong>API error</strong><br>can\'t update the loan', 'error');
          });
      }
      else {
        // show all tooltips
        Tooltip.array(loan.form.tooltips, 'show');
        Noty.displayNotes('Please check the form and try again', 'warning');
      }
    }
    else {
      loan.editMode = false;
      // exit loanInEditeMode
      vm.loanInEditeMode = false;
    }
  };

  /** Return a loan */
  vm.return = function(loan) {
    // set the returned date to today's date 
    loan.returned_on = new Date();
    // set loan.form.$dirty to true (for the save method)
    loan.form.$setDirty();
  };

  /** Delete loan from database */
  vm.delete = function(loan, index) {
    const message = `Delete loan ${loan.id} ?`;
    // disable actions buttons
    loan.deleteMode = true;
    function confirmed() {
      Data.del(loan.id, 'loans')
        .then(function() {
          // Dispose tooltips if exist
          Tooltip.array(loan.form.tooltips, 'dispose');
          // Exit loanInEditeMode
          vm.loanInEditeMode = false;
          Noty.displayNotes(`Loan ${loan.id} was deleted`, 'success');
        })
        .catch(function() {
          Noty.displayNotes('<strong>API error</strong><br>can\'t delete the loan', 'error');
        });
    }
    function canceled() {
      // enable actions buttons
      loan.deleteMode = false;
      $scope.$apply();
    }
    Noty.displayDialogs(message, confirmed, canceled);
  };

  angular.forEach(vm.loansList, function(loan, index) {
    // Call edit method if loan is in edit mode
    if (loan.editMode) {
      vm.edit(loan);
      // If missing data retrieve from loan.cache 
      if (!loan.loaned_on) {
        loan.loaned_on = loan.cache.loaned_on;
      }
      if (!loan.return_by) {
        loan.return_by = loan.cache.return_by;
      }
      if (loan.deleteMode) {
        // Call delete method if loan is in delete mode
        vm.delete(loan, index);
      }
    }
  });
};
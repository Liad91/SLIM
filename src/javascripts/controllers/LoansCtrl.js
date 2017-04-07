angular
  .module('slim')
  .controller('LoansCtrl', LoansCtrl);

LoansCtrl.$inject = ['$scope', '$filter', 'Data', 'Broadcast', 'State', 'Dates', 'Noty', 'Table'];

function LoansCtrl($scope, $filter, Data, Broadcast, State, Dates, Noty, Table) {

  const vm = this;

  /** 
   * Get API tata
   */

  const categories = ['loans', 'titles', 'patronNames'];

  Data.watch(vm, categories);

  /**
   * Get table state
   */

  State.get(vm, 'loans');
  
  /**
   * Get table methods
   */

  vm.table = new Table('loans', update);

  /** 
   * Table setters
   */

  vm.table.state = vm.state;

  vm.table.deleteMessage = 'Are you sure you want to delete this loan?';

  /**
   * Set table filters
   */

  vm.filterList = [
    { name: 'All', icon: 'fa-list-ul'},
    { name: 'Returned', icon: 'fa-check-square' },
    { name: 'Unreturned', icon: 'fa-minus-square' },
    { name: 'Overdue', icon: 'fa-clock-o' }
  ];

  Table.prototype.adjust = function(force) {
    const page = force ? 0 : this._state.currentPage;

    switch(this._state.currentFilter) {
      case 'All':
        this.filteredData = this.data;
        break;
      case 'Returned':
        this.filteredData = $filter('returned')(this.data, true);
        break;
      case 'Unreturned':
        this.filteredData = $filter('returned')(this.data, false);
        break;
      case 'Overdue':
        this.filteredData = $filter('overdue')(this.data, true);
        break;
    }

    if (this._state.searchQuery) {
      this.filteredData = $filter('filter')(this.filteredData, { $: this._state.searchQuery });
    }
    if (this._state.sortBy) {
      this.filteredData = $filter('orderBy')(this.filteredData, this._state.sortBy, this._state.sortReverse);
    }

    this.setPage(page);
  };

  Table.prototype.switchFilter = function(filter) {
    if (this.hasModifiedItem) {
      return Noty.main('Save your changes or cancel them before filtering the table', 'warning');
    }

    this.data = this.getData();
    
    this._state.currentFilter = filter;

    switch(filter) {
      case 'All':
        this.filteredData = this.data;
        break;
      case 'Returned':
        this.filteredData = $filter('returned')(this.data, true);
        break;
      case 'Unreturned':
        this.filteredData = $filter('returned')(this.data, false);
        break;
      case 'Overdue':
        this.filteredData = $filter('overdue')(this.data, true);
        break;
    }

    /** Reset sort state */
    if (this._state.sortBy) {
      this._state.sortBy = '',
      this._state.sortReverse = false;
    }

    if (this._state.searchQuery) {
      this.search(this._state.searchQuery)
    }
    else {
      this.setPage(0);
    }
  };

  Table.prototype.search = function(curQuery, prevQuery) {
    /** Display warning if there's open item and it was modified */
    if (this.hasModifiedItem) {
      this._state.searchQuery = prevQuery;
      return Noty.main('Save your changes or cancel them before searching', 'warning');
    }

    /** If search input gets shorter get the data list */
    if (prevQuery && prevQuery.length > curQuery.length) {
      return this.switchFilter(this._state.currentFilter);
    }

    /** Reset sort state */
    if (this._state.sortBy) {
      this._state.sortBy = '',
      this._state.sortReverse = false;
    }

    /** Search only if there's data */
    if (this.filteredData.length > 0) {
      this.filteredData = $filter('filter')(this.filteredData, { $: curQuery });
      this.setPage(0);
    }
  };

  /**
   * Dates handlers
   */

  /** Get tomorrow date */
   vm.getTomorrow = Dates.getTomorrow;

  /** Format the date for display "dd/MM/yyyy" */
  vm.dateDisplayFormat = Dates.dateDisplayFormat;

  /** Format the date for database "yyyy-MM-dd" */
  vm.datePostFormat = Dates.datePostFormat;

  /** 
   * Emit navigation data to MainCtrl
   */
 
  Broadcast.set('navigation', {
    title: 'Loans',
    search: vm.table.search.bind(vm.table)
  });

  /**
   * Set table data from API
   */

  $scope.$watchCollection(() => vm.loans, (list) => {
    /** Check if the data from the API arrived */
    if (list.length > 0 && list[0] !== 'loading' && list[0] !== 'timeout') {

      vm.table.setData = vm.loans;
      
      vm.table.adjust();
    }
  });

  /**
   * Restore item data on destroy
   */

  $scope.$on('$destroy', () => {
    /** Restore missing data from book.cache */
    if (vm.table.hasModifiedItem) {
      const loan = vm.table.displayedData[vm.state.editItemIndex];

      if (!loan.loaned_on) {
        loan.loaned_on = loan.cache.loaned_on;
      }
      if (!loan.return_by) {
        loan.return_by = loan.cache.return_by;
      }
    }
  });

  /**
   * Return loan
   * @param {object} loan
   */

  vm.table.return = function(loan) {
    /** Set the returned date to today's date */ 
    loan.returned_on = new Date();
    /** Set loan.modified to true to force save/cancel */
    loan.modified = true;
  };

  /**
   * Update loan
   * @param {object} loan
   */

  function update(loan) {
    const updatedLoan = {
      adjust: {}
    }

    updatedLoan.data = {
      book_id: loan.Book.id,
      patron_id: loan.Patron.id,
      loaned_on: vm.datePostFormat(loan.loaned_on),
      return_by: vm.datePostFormat(loan.return_by)
    };

    /** If loan.returned_on not exists save it as null */
    updatedLoan.data.returned_on = loan.returned_on ? vm.datePostFormat(loan.returned_on) : null;

    /** Set adjust to return and borrow to update book availablity */
    if (!loan.cache.returned_on && loan.returned_on) {
      updatedLoan.adjust.return = loan.Book.id;
    }
    else if (!loan.cache.returned_on && !loan.returned_on) {
      if (updatedLoan.data.book_id !== loan.cache.Book.id) {
        updatedLoan.adjust.return = loan.cache.Book.id;
        updatedLoan.adjust.borrow = loan.Book.id
      }
    }
    else if (loan.cache.returned_on && !loan.returned_on) {
      updatedLoan.adjust.borrow = loan.Book.id;
    }

    return updatedLoan;
  }
};
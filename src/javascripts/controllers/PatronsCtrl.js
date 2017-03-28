angular
  .module('slim')
  .controller('PatronsCtrl', PatronsCtrl);

PatronsCtrl.$inject = ['$scope', '$filter', 'Data', 'Broadcast', 'State', 'Dates', 'Noty', 'Table'];

function PatronsCtrl($scope, $filter, Data, Broadcast, State, Dates, Noty, Table) {

  const vm = this;

  /** 
   * Get API tata
   */

  const categories = ['patrons'];

  Data.watch(vm, categories);

  /**
   * Get table state
   */

  State.get(vm, 'patrons');
  
  /**
   * Get table methods
   */

  vm.table = new Table('patrons', update);

  vm.table.setState = vm.state;

  /**
   * Set table filters
   */


  Table.prototype.adjust = function(force) {
    const page = force ? 0 : this.state.currentPage;

    this.filteredData = this.data;

    if (this.state.searchQuery) {
      this.filteredData = $filter('filter')(this.filteredData, { $: this.state.searchQuery });
    }
    if (this.state.sortBy) {
      this.filteredData = $filter('orderBy')(this.filteredData, this.state.sortBy, this.state.sortReverse);
    }

    this.setPage(page);
  };

  Table.prototype.switchFilter = function(filter) {
    if (this.hasModifiedItem) {
      return Noty.main('Save your changes or cancel them before filtering the table', 'warning');
    }

    this.filteredData = this.getData();
    
    /** Reset sort state */
    if (this.state.sortBy) {
      this.state.sortBy = '',
      this.state.sortReverse = false;
    }

    if (this.state.searchQuery) {
      this.search(this.state.searchQuery)
    }
    else {
      this.setPage(0);
    }
  };

  Table.prototype.search = function(curQuery, prevQuery) {
    /** Display warning if there's open item and it was modified */
    if (this.hasModifiedItem) {
      this.state.searchQuery = prevQuery;
      return Noty.main('Save your changes or cancel them before searching', 'warning');
    }

    /** If search input gets shorter get the data list */
    if (prevQuery && prevQuery.length > curQuery.length) {
      return this.switchFilter(this.state.currentFilter);
    }

    /** Reset sort state */
    if (this.state.sortBy) {
      this.state.sortBy = '',
      this.state.sortReverse = false;
    }

    /** Search only if there's data */
    if (this.filteredData.length > 0) {
      this.filteredData = $filter('filter')(this.filteredData, { $: curQuery });
      this.setPage(0);
    }
  };

  /** 
   * Emit navigation data to MainCtrl
   */
 
  Broadcast.set('navigation', {
    title: 'Patrons',
    search: vm.table.search.bind(vm.table)
  });

  /**
   * Set table data from API
   */

  $scope.$watchCollection(() => vm.patrons, (list) => {
    /** Check if the data from the API arrived */
    if (list.length > 0 && list[0] !== 'loading' && list[0] !== 'timeout') {

      vm.table.setData = vm.patrons;
      
      vm.table.adjust();
    }
  });

  /**
   * Restore item data on destroy
   */

  $scope.$on('$destroy', () => {
    /** Restore missing data from patron.cache */
    if (vm.table.hasModifiedItem) {
      const patron = vm.table.displayedData[vm.state.editItemIndex];

      if (!patron.first_name) {
        patron.first_name = patron.cache.first_name;
      }
      if (!patron.last_name) {
        patron.last_name = patron.cache.last_name;
      }
      if (!patron.address) {
        patron.address = patron.cache.address;
      }
      if (!patron.email) {
        patron.email = patron.cache.email;
      }
      if (!patron.first_name) {
        patron.first_name = patron.cache.first_name;
      }
      if (!patron.zip) {
        patron.zip = patron.cache.zip;
      }
    }
  });

  /**
   * Update book
   * @param {object} patron
   */

  function update(patron) {
    const updatedPatron = {}

    updatedPatron.data = {
      first_name: patron.first_name,
      last_name: patron.last_name,
      address: patron.address,
      email: patron.email,
      zip_code: patron.zip_code
    };

    // Set adjust to true if patron name changed (will cause to update of patronNames and loansList)
    updatedPatron.adjust = patron.first_name !== patron.cache.first_name || patron.last_name !== patron.cache.last_name ? true : false;

    return updatedPatron;
  }
};
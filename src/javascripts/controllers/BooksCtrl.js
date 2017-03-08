angular
  .module('slim')
  .controller('BooksCtrl', BooksCtrl);

BooksCtrl.$inject = ['$scope', '$filter', 'Data', 'Broadcast', 'State', 'Dates', 'Noty', 'Table'];

function BooksCtrl($scope, $filter, Data, Broadcast, State, Dates, Noty, Table) {

  const vm = this;

  /** 
   * Get API Data
   */

  const categories = ['books', 'titles', 'genres', 'authors'];

  Data.watch(vm, categories);

  /**
   * Get Table State
   */

  State.get(vm, 'books');
  
  /**
   * Get Table Methods
   */

  vm.table = new Table('books', update);

  vm.table.setState = vm.state;

  /**
   * Set Table Filters
   */

  Table.prototype.adjust = function(force) {
    const page = force ? 0 : this.state.currentPage;

    switch(this.state.currentFilter) {
      case 'All':
        this.filteredData = this.data;
        break;
      case 'Available':
        this.filteredData = $filter('availability')(this.data, true);
        break;
      case 'Unavailable':
        this.filteredData = $filter('availability')(this.data, false);
        break;
    }

    if (this.state.searchQuery) {
      this.filteredData = $filter('filter')(this.filteredData, { title: this.state.searchQuery });
    }
    if (this.state.sortBy) {
      this.filteredData = $filter('orderBy')(this.filteredData, this.state.sortBy, this.state.sortReverse);
    }

    this.setPage(page);
  };

  Table.prototype.switchFilter = function(filter) {
    if (this.hasModifiedItem) {
      return Noty.displayNotes('Save your changes or cancel them before filtering the table', 'warning');
    }

    this.data = this.getData();
    
    this.state.currentFilter = filter;

    switch(filter) {
      case 'All':
        this.filteredData = this.data;
        break;
      case 'Available':
        this.filteredData = $filter('availability')(this.data, true);
        break;
      case 'Unavailable':
        this.filteredData = $filter('availability')(this.data, false);
        break;
    }

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

  Table.prototype.search = function(newVal, oldVal) {
    /** Display warning if there's open item and it was modified */
    if (this.hasModifiedItem) {
      this.state.searchQuery = oldVal;
      return Noty.displayNotes('Save your changes or cancel them before searching', 'warning');
    }

    /** If search input gets shorter get the data list */
    if (oldVal && oldVal.length > newVal.length) {
      return this.switchFilter(this.state.currentFilter);
    }

    /** Reset sort state */
    if (this.state.sortBy) {
      this.state.sortBy = '',
      this.state.sortReverse = false;
    }

    /** Search only if there's data */
    if (this.filteredData.length > 0) {
      this.filteredData = $filter('filter')(this.filteredData, { title: newVal });
      this.setPage(0);
    }
  };


  /**
   * Set Table Filters
   */
    
  const filterList = [
    { name: 'All', icon: 'fa-list-ul'},
    { name: 'Available', icon: 'fa-check-square' },
    { name: 'Unavailable', icon: 'fa-minus-square' },
  ];

  /** 
   * Emit navigation data to MainCtrl
   */
 
  Broadcast.set('navigation', {
    title: 'Books',
    category: 'books',
    filterList,
    switchFilter: vm.table.switchFilter.bind(vm.table),
    search: vm.table.search.bind(vm.table),
    changeable: vm.table.changeable.bind(vm.table),
    adjust: vm.table.adjust.bind(vm.table)
  });

  $scope.$watchCollection(() => vm.books, (list) => {
    /** Check if the data from the API arrived */
    if (list.length > 0 && list[0] !== 'loading' && list[0] !== 'timeout') {

      vm.table.setData = vm.books;
      
      vm.table.adjust();
    }
  });

  $scope.$on('$destroy', () => {
    /** Restore missing data from book.cache */
    if (vm.table.hasModifiedItem) {
      const book = vm.table.displayedData[vm.state.editItemIndex];

      if (!book.title) {
        book.title = book.cache.title;
      }
      if (!book.first_published) {
        book.first_published = book.cache.first_published;
      }
      if (!book.quantity) {
        book.quantity = book.cache.quantity;
      }
    }
  });
  
  /**
   * Dates Handlers
   */

  vm.getCurrentYear = Dates.getCurrentYear;

  /**
   * build the new 
   * @param {object} book
   */

  function update(book) {
    const construct = {}

    construct.data = {
      title: book.title,
      author_id: book.Author.id,
      genre_id: book.Genre.id,
      first_published: book.first_published
    };

    let remainder;
    // If quantity changed update quantity and available columns by the result of the new quantity minus the old quantity
    if (book.quantity !== book.cache.quantity) {
      remainder = book.quantity - book.cache.quantity;
      construct.data.quantity = book.quantity;
      construct.data.available = book.available + remainder;
    }
    // Check if the title was changed
    const titleChanged = book.title !== book.cache.title ? true : false
    // Set adjust to true if remainder || titleChanged (will cause to update of titlesList)
    construct.adjust = remainder || titleChanged ? true : false;

    return construct;
  }
};
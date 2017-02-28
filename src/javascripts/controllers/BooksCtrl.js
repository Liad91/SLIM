angular
  .module('slim')
  .controller('BooksCtrl', BooksCtrl);

BooksCtrl.$inject = ['$scope', '$filter', 'Data', 'Broadcast', 'Settings', 'Dates', 'Noty', 'Tooltip'];

function BooksCtrl($scope, $filter, Data, Broadcast, Settings, Dates, Noty, Tooltip) {

  const vm = this;

  /** 
   * Get Table Data
   */

  const services = ['titles', 'authors', 'genres', 'books'];

  Data.subscribe(vm, services);

  $scope.$on('$destroy', function() {
    Data.unsubscribe(vm, services);
  });

  /**
   * Set Table Settings
   */

  Settings.get(vm, 'books');
  Settings.get(vm, 'global');

  /**
   * Sorting Method
   */

  vm.sortBy = function(name) {
    let page;

    if (!name) {
      name = vm.orderBy;
      page = vm.currentPage;
    }
    else {
      vm.reverse = vm.orderBy === name ? !vm.reverse : false;
      vm.orderBy = name;
      Settings.set('books', 'reverse', vm.reverse);
      Settings.set('books', 'orderBy', name);
      page = 1;
    }
    vm.booksFilteredList = $filter('orderBy')(vm.booksFilteredList, name, vm.reverse);

    vm.setPage(page);
  }

  /**
   * Handle Table Pagination
   */

  vm.setPage = function(page) {
    if (vm.books && vm.books[vm.itemInEditIndex] && vm.books[vm.itemInEditIndex].changed) {
      Noty.displayNotes('Please save your changes or cancel them before editing other books', 'warning');
      return false;
    }

    // Close books in edit mode  
    if (angular.isNumber(vm.itemInEditIndex) && vm.books) {
      vm.cancel(vm.books[vm.itemInEditIndex]);
    }

    vm.currentPage = page;
    Settings.set('books', 'currentPage', page);

    const start = (page - 1) * vm.itemsPerPage;
    const end = start + vm.itemsPerPage;

    // The paging and filtered array of all the books
    vm.books = vm.booksFilteredList.slice(start, end);

    return true;
  };

  $scope.$watchCollection(function() { return vm.booksList }, function(list) {
    if (list.length > 0 && list[0] !== 'loading' && list[0] !== 'timeout') {
      // "middleware" property allow to filter and paging booksList the array without triggering the $watchCollection; 
      vm.booksFilteredList = vm.booksList;
      console.log(vm.searchQuery)
      if(vm.searchQuery) {
        vm.search(vm.searchQuery);
      }
      // Sort the table if vm.orderBy is defined
      if (vm.orderBy) {
        vm.sortBy();
      }
      // Set the page
      else {
        vm.setPage(vm.currentPage);
      }
      
      // Retrieve Item In Edit
      if (vm.itemInEditIndex) {
        const book = vm.books[vm.itemInEditIndex];
        vm.edit(book, vm.itemInEditIndex);
        // If missing data retrieve from book.cache 
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
    }
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

  vm.search = function(query, $event) {
    if ($event) {
      if ($event.key === 'Backspace') {
        vm.booksFilteredList = vm.booksList;
      }
    }

    // Filter the booksFilteredList if it contains items
    if (vm.booksFilteredList.length > 0) {
      vm.booksFilteredList = $filter('filter')(vm.booksFilteredList, { title: query });

      if ($event) {
        vm.setPage(1);
      }
      if (query) {
        vm.searchQuery = query;
        Settings.set('books', 'searchQuery', query);
      }
    }
  }

  /** 
   * Emit header data to MainCtrl
   */

  Broadcast.set('header-data', {
    title: 'Books',
    currentFilter: vm.currentFilter,
    filters: vm.filters,
    switchFilter: vm.switchFilter,
    searchFilter: vm.search,
    searchQuery: ''
  });
  
  /**
   * Dates Handlers
   */

  vm.getCurrentYear = Dates.getCurrentYear;

  /** 
   * Table Functions
   */

  /** Edit book */
  vm.edit = function(book, index) {
    if (angular.isNumber(vm.itemInEditIndex)) {
      if (vm.itemInEditIndex !== index) {
        const lastBook = vm.books[vm.itemInEditIndex];
        // If lastBook changed return a warning message
        if (lastBook.changed) {
          return Noty.displayNotes('Please save your changes or cancel them before editing other books', 'warning');
        }
        // Close lastBook
        else {
          vm.cancel(lastBook);
        }
      }
    }
    // Update itemInEditIndex
    vm.itemInEditIndex = index;
    Settings.set('books', 'itemInEditIndex', index);
    // make a copy of book controls in book.cache if the book wasn't changed
    if (!book.changed) {
      book.cache = angular.extend({}, book);
    }
    book.editMode = true;
  };

  /** Exit from edit mode without saving the changes */
  vm.cancel = function(book) {
    if (book.changed) {
      // Todo: dispose tooltips if exist
      Tooltip.array(book.form.tooltips, 'dispose');
      // retrieve book from book.cache
      angular.extend(book, book.cache);
      book.changed = false;
    }
    if (book.deleteMode) {
      Noty.closeAll();
      book.deleteMode = false;
    }
    // clear book.cache object
    book.cache = {};
    // Exit from edit mode
    book.editMode = false;
    // Update itemInEditIndex
    vm.itemInEditIndex = '';
    Settings.set('books', 'itemInEditIndex', '');
  };

  /** Save changes in database */
  vm.save = function(book) {
    if (book.form.$valid) {
      const data = {
        title: book.title,
        author_id: book.Author.id,
        genre_id: book.Genre.id,
        first_published: book.first_published
      };

      let remainder;
      // If quantity changed update quantity and available columns by the result of the new quantity minus the old quantity
      if (book.quantity !== book.cache.quantity) {
        remainder = book.quantity - book.cache.quantity;
        data.quantity = book.quantity;
        data.available = book.available + remainder;
      }
      // Check if the title was changed
      const titleChanged = book.title !== book.cache.title ? true : false
      // Set adjust to true if remainder || titleChanged (will cause to update of titlesList)
      const adjust = remainder || titleChanged ? true : false;

      Data.put(book.id, data, 'books', adjust)
        .then(function() {
          book.editMode = false;
          Noty.displayNotes(`Book updated<br><small>"${book.title}"</small>`, 'success');
          // Update itemInEditIndex
          vm.itemInEditIndex = '';
          Settings.set('books', 'itemInEditIndex', '');
          // clear book.cache object
          book.cache = {};
          book.changed = false;
        })
        .catch(function() {
          Noty.displayNotes('<strong>API error</strong><br>can\'t update the book', 'error');
        });
    }
    else {
      // Show all tooltips
      Tooltip.array(book.form.tooltips, 'show');
      Noty.displayNotes('Please check the form and try again', 'warning');
    }
  };

  /** Delete book from database */
  vm.delete = function(book, index) {
    // Disable actions buttons
    book.deleteMode = true;
    Noty.clearQueue();
    const message = `Delete "${book.title}"?<br><small>(all associated loans to this book will also be deleted)</small>`
    function confirmed() {
      Data.del(book.id, 'books')
        .then(function() {
          // Dispose tooltips if exist
          Tooltip.array(book.form.tooltips, 'dispose');
          if (itemInEditIndex === index) {
            // Update itemInEditIndex
            vm.itemInEditIndex = '';
            Settings.set('books', 'itemInEditIndex', '');
          }
          Noty.displayNotes(`${book.title} was deleted`, 'success');
        })
        .catch(function() {
          Noty.displayNotes('<strong>API error</strong><br>can\'t delete the book', 'error');
        });
    }
    function canceled() {
      // Enable actions buttons
      book.deleteMode = false;
      $scope.$apply();
    }
    Noty.displayDialogs(message, confirmed, canceled);
  };
};
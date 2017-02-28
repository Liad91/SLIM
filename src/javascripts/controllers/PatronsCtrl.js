angular
  .module('slim')
  .controller('PatronsCtrl', PatronsCtrl);

PatronsCtrl.$inject = ['$scope', 'Data', 'Broadcast' ,'Noty', 'Tooltip'];

function PatronsCtrl($scope, Data, Broadcast, Noty, Tooltip) {

  const vm = this;

  /** 
   * Get Table Data
   */

  const services = ['patrons'];

  Data.subscribe(vm, services);

  $scope.$on('$destroy', function() {
    Data.unsubscribe(vm, services);
    if (vm.patronInEditeMode) {
      angular.forEach(vm.patronsList, function(patron) {
        if (patron.editMode) {
          patron.form.$setSubmitted();;
        }
      });
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

  /** 
   * Emit header data to MainCtrl
   */

  Broadcast.set('header-data', {
    title: 'Patrons',
    currentFilter: vm.currentFilter,
    filters: vm.filters,
    switchFilter: vm.switchFilter
  });
  
  /** 
   * Table Functions
   */

  /** Edit patron */
  vm.edit = function(patron) {
    // Make sure that the the function will run only if another patron is on edit mode
    if (patron.patronInEditeMode) {
      return;
    }
    vm.patronInEditeMode = true;
    // make a copy of patron controls in patron.cache if the patron wasn't changed
    if (!patron.changed) {
      patron.cache = angular.extend({}, patron);
    }
    patron.editMode = true;
  };

  /** Exit from edit mode without saving the changes */
  vm.cancel = function(patron) {
    // Todo: dispose tooltips if exist
    Tooltip.array(patron.form.tooltips, 'dispose');
    // retrieve patron from patron.cache
    angular.extend(patron, patron.cache);
    // clear patron.cache object
    patron.cache = {};
    patron.changed = false;
    // Exit from edit mode
    patron.editMode = false;
    // Exit patronInEditeMode
    vm.patronInEditeMode = false;
  };

  /** Save changes in database */
  vm.save = function(patron) {
    if (patron.form.$dirty || patron.changed) {
      patron.form.$setSubmitted();
      if (patron.form.$valid) {
        const data = {
          first_name: patron.first_name,
          last_name: patron.last_name,
          address: patron.address,
          email: patron.email,
          zip_code: patron.zip_code
        };

        // Set adjust to true if patron name changed (will cause to update of patronNames and loansList)
        const adjust = patron.first_name !== patron.cache.first_name || patron.last_name !== patron.cache.last_name ? true : false;

        Data.put(patron.id, data, 'patrons', adjust)
          .then(function() {
            patron.editMode = false;
            // Exit patronInEditeMode
            vm.patronInEditeMode = false;
            Noty.displayNotes('Patron updated', 'success');
            // clear patron.cache object
            patron.cache = {};
            patron.changed = false;
          })
          .catch(function() {
            Noty.displayNotes('<strong>API error</strong><br>can\'t update the patron', 'error');
          });
      }
      else {
        // Show all tooltips
        Tooltip.array(patron.form.tooltips, 'show');
        Noty.displayNotes('Please check the form and try again', 'warning');
      }
    }
    else {
      patron.editMode = false;
      // Exit patronInEditeMode
      vm.patronInEditeMode = false;
    }
  };

  /** Delete book from database */
  vm.delete = function(patron, index) {
    // Disable actions buttons
    patron.deleteMode = true;
    Noty.clearQueue();
    const message = `Delete "${patron.first_name} ${patron.last_name}"?<br><small>(all associated loans to this patron will also be deleted)</small>`
    function confirmed() {
      Data.del(patron.id, 'patrons')
        .then(function() {
          // Dispose tooltips if exist
          Tooltip.array(patron.form.tooltips, 'dispose');
          // Exit patronInEditeMode
          vm.patronInEditeMode = false;
          Noty.displayNotes(`${patron.first_name} ${patron.last_name} was deleted`, 'success');
        })
        .catch(function() {
          Noty.displayNotes('<strong>API error</strong><br>can\'t delete the patron', 'error');
        });
    }
    function canceled() {
      // Enable actions buttons
      patron.deleteMode = false;
      $scope.$apply();
    }
    Noty.displayDialogs(message, confirmed, canceled);
  };

  angular.forEach(vm.patronsList, function(patron, index) {
    // Call edit method if patron is in edit mode
    if (patron.editMode) {
      vm.edit(patron);
      // If missing data retrieve from patron.cache
      if (!patron.first_name) {
        patron.first_name = patron.cache.first_name
      }
      if (!patron.last_name) {
        patron.last_name = patron.cache.last_name
      }
      if (!patron.address) {
        patron.address = patron.cache.address
      }
      if (!patron.email) {
        patron.email = patron.cache.email
      }
      if (!patron.zip_code) {
        patron.zip_code = patron.cache.zip_code
      }
      // Call delete method if patron is in delete mode
      if (patron.deleteMode) {
        vm.delete(patron, index);
      }
    }
  });
};
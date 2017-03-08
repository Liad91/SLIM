// angular
//   .module('slim')
//   .service('Table', Table);

// Table.$inject = ['$filter', 'State', 'Data', 'Tooltip', 'Noty'];

// function Table($filter, State, Data, Tooltip, Noty) {

//   /**
//    * Adding Table Methods To Controllers
//    * @param {string} category Category name
//    * @param {function} update Update item
//    */
//   function Service(category, update) {

//     const self = this;

//     self.category = category;
//     self.update = update;
//     self.nav = [];

//     State.get(self, self.category);

//     self.setTable = function(table) {
//       self.list = table;
      
//       self.getTable = function() {
//         return table;
//       }
//     };
    
//     self.sort = function(key) {
//       // Display warning if there's open item and it was modified
//       if (self.hasModifiedItem()) {
//         return Noty.displayNotes('Save your changes or cancel them before sorting the table', 'warning');
//       }

//       // Don't change the page when called from controller
//       let page = self.state.page;

//       // When called from view
//       if (key) {
//         self.state.reverse = self.state.sort === key ? !self.state.reverse : false;
//         self.state.sort = key;
//         page = 1;
//       }

//       self.list = $filter('orderBy')(self.list, self.state.sort, self.state.reverse);
//       self.setPage(page);
//     };

//     self.setPage = function(page) {
//       // Display warning if there's open item and it was modified
//       if (self.hasModifiedItem()) {
//         return Noty.displayNotes('Save your changes or cancel them before changing pages', 'warning');
//       }

//       // Close item open item
//       if (page !== self.state.page && angular.isNumber(self.state.editIndex) && self.data) {
//         self.cancel(self.data[self.state.editIndex]);
//       }

//       const length = self.state.pagingLength;
//       const totalPages = Math.ceil(self.list.length / self.state.itemsPerPage);

//       self.totalPages = totalPages;

//       if(self.nav.length < 1 || self.state.page !== page) {
//         const nav = [];

//         let start;
//         let end;

//         // If less pages than length show all
//         if (totalPages <= length) {
//           start = 1;
//           end = totalPages;
//         }
//         // More pages than length calculate start and end pages
//         else {
//           if (page <= (Math.ceil(length / 2))) {
//             start = 1;
//             end = length;
//           }
//           else if (page + (Math.floor(length / 2)) >= totalPages) {
//             start = totalPages - (length - 1);
//             end = totalPages;
//           }
//           else {
//             start = page - (Math.floor(length / 2));
//             end = page + (Math.floor(length / 2));
//           }
//         }

//         for(let i = start; i <= end; i++) {
//           nav.push(i);
//         }
//         self.nav = nav;
//       }

//       if(page < 1) {
//         page = 1;
//       }
//       if (page > totalPages) {
//         page = totalPages;
//       }

//       self.state.page = page;

//       const start = (page - 1) * self.state.itemsPerPage;
//       const end = start + self.state.itemsPerPage;

//       // The paging and filtered array of all the books
//       self.data = self.list.slice(start, end);
//     };

//     self.search = function(newVal, oldVal) {
//       // Display warning if there's open item and it was modified
//       if (self.hasModifiedItem()) {
//         self.state.search = oldVal
//         return Noty.displayNotes('Save your changes or cancel them before searching', 'warning');
//       }

//       let page = 0;

//       if (oldVal.length > newVal.length) {
//         self.list = self.getTable();
//       }
      
//       // Don't change the page when called from controller
//       if (newVal === oldVal) {
//         page = self.state.page;
//       }

//       // Filter the vm.books.filter if it contains items
//       if (self.list.length > 0) {
//         self.list = $filter('filter')(self.list, { $: newVal });
//         self.setPage(page);
//       }
//     };

//     self.save = function(item) {
//       if (item.form.$valid) {
//         const newItem = self.update(item);
//         Data.put(item.id, newItem.data, self.category, newItem.adjust)
//           .then(function() {
//             item.editMode = false;
//             Noty.displayNotes('Item was updated successfully', 'success');
//             // Update state object
//             self.state.editIndex = '';
//             // clear item.cache object
//             item.cache = {};
//             item.modified = false;
//           })
//           .catch(function(error) {
//             Noty.displayNotes('<strong>API error</strong><br>can\'t update the item', 'error');
//             throw new Error(error);
//           });
//       }
//       else {
//         // Show all tooltips
//         Tooltip.array(item.form.tooltips, 'show');
//         Noty.displayNotes('Check the form and try again', 'warning');
//       }
//     };

//     self.edit = function(item, index) {
//       if (angular.isNumber(self.state.editIndex)) {
//         if (self.state.editIndex !== index) {
//           const openItem = self.data[self.state.editIndex];
//           // If the open item changed return a warning message
//           if (openItem.modified) {
//             return Noty.displayNotes('Save your changes or cancel them before editing other item', 'warning');
//           }
//           // Close open item
//           else {
//             self.cancel(openItem);
//           }
//         }
//       }
//       // Update state object
//       self.state.editIndex = index;
//       // make a copy of the item controls in item.cache if the item wasn't changed
//       if (!item.modified) {
//         item.cache = angular.extend({}, item);
//       }
//       item.editMode = true;
//     };

//     self.cancel = function(item) {
//       if (item.modified) {
//         // dispose tooltips if exist
//         Tooltip.array(item.form.tooltips, 'dispose');
//         // retrieve item from item.cache
//         angular.extend(item, item.cache);
//         item.modified = false;
//       }
//       if (item.deleteMode) {
//         Noty.closeAll();
//         item.deleteMode = false;
//       }
//       // clear item.cache object
//       item.cache = {};
//       // Exit from edit mode
//       item.editMode = false;
//       // Update state object
//       self.state.editIndex = '';
//     };

//     self.delete = function(item, index) {
//       // Disable actions buttons
//       item.deleteMode = true;
//       Noty.clearQueue();
//       const message = 'Are you sure you want to delete this item?<br><small>(all associated loans to this book will also be deleted)</small>';
//       function confirmed() {
//         Data.del(item.id, self.category)
//           .then(function() {
//             // Dispose tooltips if exist
//             Tooltip.array(item.form.tooltips, 'dispose');
//             if (self.state.editIndex === index) {
//               // Update state object
//               self.state.editIndex = '';
//             }
//             Noty.displayNotes('Item was deleted successfully', 'success');
//           })
//           .catch(function(error) {
//             Noty.displayNotes('<strong>API error</strong><br>can\'t delete the item', 'error');
//             throw new Error(error);
//           });
//       }
//       function canceled() {
//         // Enable actions buttons
//         item.deleteMode = false;
//       }
//       Noty.displayDialogs(message, confirmed, canceled);
//     };

//     /** Checking if there's modified item in the current list */
//     self.hasModifiedItem = function() {
//       return self.data && self.state.editIndex && self.data[self.state.editIndex].modified;
//     }
//   }
//   return Service;
// }
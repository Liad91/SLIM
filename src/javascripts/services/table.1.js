angular
  .module('slim')
  .service('Table', Table);

Table.$inject = ['$filter', 'State', 'Data', 'Tooltip', 'Noty'];

function Table($filter, State, Data, Tooltip, Noty) {

  class Service {

    constructor(category, update) {
      this.category = category;
      this.update = update;
      this.nav = [];
    }

    /**
     * set the table data
     * @param {array} data 
     */

    set setData(data) {
      this.data = data;
      this.getData = () => data;
    }

    /**
     * set the table state
     * @param {array} state 
     */

    set setState(state) {
      this.state = state;
    }
    
    /**
     * sort the table by column
     * @param {string} column 
     */

    sortBy(column) {
      // Display warning if there's open item and it was modified
      if (this.hasModifiedItem) {
        return Noty.displayNotes('Save your changes or cancel them before sorting the table', 'warning');
      }

      this.state.sortReverse = this.state.sortBy === column ? !this.state.sortReverse : false;
      this.state.sortBy = column;

      this.filteredData = $filter('orderBy')(this.filteredData, column, this.state.sortReverse);
      this.setPage(1);
    }

    /**
     * change the page and adapt the navigation
     * @param {number} page 
     */

    setPage(page) {
      /** Display warning if there's open item and it was modified */
      if (this.hasModifiedItem) {
        return Noty.displayNotes('Save your changes or cancel them before changing pages', 'warning');
      }

      /** Close item open item */
      if (page !== this.state.currentPage && angular.isNumber(this.state.editItemIndex) && this.displayedData) {
        this.cancel(this.displayedData[this.state.editItemIndex]);
      }

      const length = this.state.paginationLength;
      this.totalPages = Math.ceil(this.filteredData.length / this.state.itemsPerPage);

      if(this.nav.length < 1 || this.state.currentPage !== page) {
        const nav = [];

        let start;
        let end;

        /** If less pages than length show all */
        if (this.totalPages <= length) {
          start = 1;
          end = this.totalPages;
        }
        /** More pages than length calculate start and end pages */
        else {
          if (page <= (Math.ceil(length / 2))) {
            start = 1;
            end = length;
          }
          else if (page + (Math.floor(length / 2)) >= this.totalPages) {
            start = this.totalPages - (length - 1);
            end = this.totalPages;
          }
          else {
            start = page - (Math.floor(length / 2));
            end = page + (Math.floor(length / 2));
          }
        }

        for(let i = start; i <= end; i++) {
          nav.push(i);
        }
        this.nav = nav;
      }

      if(page < 1) {
        page = 1;
      }
      if (page > this.totalPages) {
        page = this.totalPages;
      }

      this.state.currentPage = page;

      const start = (page - 1) * this.state.itemsPerPage;
      const end = start + this.state.itemsPerPage;

      /** The paging and filtered array of all the books */
      this.displayedData = this.filteredData.slice(start, end);
    }

    changeable() {
      if (this.hasModifiedItem) {
        Noty.displayNotes('Save your changes or cancel them before changing the table settings', 'warning');
        return false;
      }
      return true;
    }

    /**
     * save the changes in the item to the database
     * @param {object} item 
     */

    save(item) {
      if (item.form.$valid) {
        const newItem = this.update(item);
        Data.put(item.id, newItem.data, this.category, newItem.adjust)
          .then(() => {
            item.editMode = false;
            Noty.displayNotes('Item was updated successfully', 'success');
            /** Update state object */
            this.state.editItemIndex = '';
            /** clear item.cache object */
            item.cache = {};
            item.modified = false;
            this.adjust();
          })
          .catch(error => {
            Noty.displayNotes('<strong>API error</strong><br>can\'t update the item', 'error');
            throw new Error(error);
          });
      }
      else {
        /** Show all tooltips */
        Tooltip.array(item.form.tooltips, 'show');
        Noty.displayNotes('Check the form and try again', 'warning');
      }
    }

    /**
     * enter to edit mode in the given item
     * @param {object} item 
     * @param {number} index 
     */

    edit(item, index) {
      if (angular.isNumber(this.state.editItemIndex)) {
        if (this.state.editItemIndex !== index) {
          const openedItem = this.displayedData[this.state.editItemIndex];
          /** If the open item changed return a warning message */
          if (openedItem.modified) {
            return Noty.displayNotes('Save your changes or cancel them before editing other item', 'warning');
          }
          /** Close open item */
          else {
            this.cancel(openedItem);
          }
        }
      }
      /** Update state object */
      this.state.editItemIndex = index;
      /** make a copy of the item controls in item.cache if the item wasn't changed */
      if (!item.modified) {
        item.cache = angular.extend({}, item);
      }
      item.editMode = true;
    }
    
    /**
     * exit edit mode in the given item
     * @param {object} item 
     */

    cancel(item) {
      if (item.modified) {
        /** dispose tooltips if exist */
        Tooltip.array(item.form.tooltips, 'dispose');
        /** retrieve item from item.cache */
        angular.extend(item, item.cache);
        item.modified = false;
      }
      if (item.deleteMode) {
        Noty.closeAll();
        item.deleteMode = false;
      }
      /** clear item.cache object */
      item.cache = {};
      /** Exit from edit mode */
      item.editMode = false;
      /** Update state object */
      this.state.editItemIndex = null;
    }

    /**
     * delete item from the table
     * @param {object} item
     * @param {number} index
     */

    delete(item, index) {
      const self = this;

      /** Disable actions buttons */
      item.deleteMode = true;
      Noty.clearQueue();
      const message = 'Are you sure you want to delete this item?<br><small>(all associated loans to this book will also be deleted)</small>';
      const confirmed = () => {
        Data.del(item.id, this.category)
          .then(() => {
            /** Dispose tooltips if exist */
            Tooltip.array(item.form.tooltips, 'dispose');
            if (this.state.editItemIndex === index) {
              /** Update state object */
              this.state.editItemIndex = '';
            }
            Noty.displayNotes('Item was deleted successfully', 'success');
          })
          .catch(error => {
            Noty.displayNotes('<strong>API error</strong><br>can\'t delete the item', 'error');
            throw new Error(error);
          });
      }
      const canceled = () => {
        /** Enable actions buttons */
        item.deleteMode = false;
      }
      Noty.displayDialogs(message, confirmed, canceled);
    }

    /**
     * Checking if there's modified item in the current list
     * @return {boolean}
     */

    get hasModifiedItem() {
      return this.displayedData && angular.isNumber(this.state.editItemIndex) && this.displayedData[this.state.editItemIndex].modified;
    }
  }
  return Service;
}
angular
  .module('slim')
  .service('Data', Data);

Data.$inject = ['Api'];

function Data(Api) {

  class Data {

    constructor() {
      this.service = {};

      /** 
       * Helpers methods
       */

      this.strDateToObj = data => {
        if (angular.isArray(data)) {
          return data.map(loan => {
            loan.loaned_on = new Date(loan.loaned_on);
            loan.return_by = new Date(loan.return_by);
            if (loan.returned_on) {
              loan.returned_on = new Date(loan.returned_on);
            }
            return loan;
          });
        }
        else if (angular.isObject(data)) {
          data.loaned_on = new Date(data.loaned_on);
          data.return_by = new Date(data.return_by);
          if (data.returned_on) {
            data.returned_on = new Date(data.returned_on);
          }
          return data;
        }
      };

      this.borrowBook = id => {
        const categories = [this.service.titles, this.service.books];

        angular.forEach(categories, category => {
          const data = category.data.find(data => data.id === id);
          /** Update loaned property in books */
          if (data.loaned) {
            data.loaned += 1;
          }
          data.available -= 1;
        });
      };

      this.returnBook = id => {
        const categories = [this.service.titles, this.service.books];

        angular.forEach(categories, category => {
          const data = category.data.find(data => data.id === id);
          /** Update loaned property in books */
          if (data.loaned) {
            data.loaned -= 1;
          }
          data.available += 1;
        });
      };
    }

    /** Set new category */
    set(categories) {
    	angular.forEach(categories, category => {
      	this.service[category.name] = {};
        
        const categoryObject = this.service[category.name];
        
        categoryObject.watchers = [];
        categoryObject.data = [];

        if (category.post) {
          categoryObject.post = category.post;
        }

        if (category.put) {
          categoryObject.put = category.put;
        }

        if (category.del) {
          categoryObject.del = category.del;
        }

        category.get
          .then(resp => {            
            if (category.name === 'loans') {
              resp.data = this.strDateToObj(resp.data);
            }
            /** Update the category.data array with the data from the database */
            angular.extend(categoryObject.data, resp.data);
          })
          .catch(() => {
            angular.extend(categoryObject.data, ['timeout']);
          });
      });
    }

    watch(scope, categories) {

      if(!angular.isArray(categories)) {
        throw new Error('Data.watch method require array of categories to watch on.');
      }

      angular.forEach(categories, category => {
        if (!angular.isObject(this.service[category])) {
          throw new Error(`Invalid category name! ${category} is not an object.`);
        }

        scope[category] = this.service[category].data;
      });
    }

    post(data, category) {

      if (!this.service[category].post) {
        throw new Error(`${category} category does not contain a post method`);
      }

      return this.service[category].post(data)
        .then(resp => {
          if (category === 'loans') {
            resp.data = this.strDateToObj(resp.data);
          }
          this.service[category].data.push(resp.data);

          /** Update service.titles.data */
          if (category === 'books') {
            const title = {
              id: resp.data.id,
              title: resp.data.title,
              available: resp.data.available
            };
            this.service.titles.data.push(title);
          }

          /** Update books availablity */
          if (category === 'loans') {
            this.borrowBook(data.book_id);
          }

          /** Update service.patronNames */
          if (category === 'patrons') {
            const patron = {
              id: resp.data.id,
              full_name: `${resp.data.first_name} ${resp.data.last_name}`
            }
            this.service.patronNames.data.push(patron);
          }
        })
        .catch(error => {
          throw new Error(error);
        });
    }

    put(id, data, category, adjust) {
      const self = this;

      if (!this.service[category].put) {
        throw new Error(`${category} category does not contain a put method`);
      }

      return this.service[category].put(id, data)
        .then(resp => {
          if (category === 'loans') {
            resp.data = this.strDateToObj(resp.data);

            /** Update books availablity */
            if (adjust.return) {
              this.returnBook(adjust.return);
            }
            if (adjust.borrow) {
              this.borrowBook(adjust.borrow);
            }
          }

          const data = this.service[category].data.find(data => data.id === resp.data.id);

          angular.extend(data,resp.data);
              

          if (category === 'books' && adjust) {
            /** Update service.titles.data */
            const data = this.service.titles.data.find(data => data.id === resp.data.id);

            const title = {
              id: resp.data.id,
              title: resp.data.title,
              available: resp.data.available
            }

            angular.extend(data, title);

            /** Update service.loans.data */
            angular.forEach(this.service.loans.data, data => {
              if (data.Book.id === id) {
                data.Book.title = resp.data.title;
              }
            });
          }

          if (category === 'patrons' && adjust) {
            const full_name = `${resp.data.first_name} ${resp.data.last_name}`

            /** Update service.patronNames.data */
            const data = this.service.patronNames.data.find(data => data.id === id);

            data.full_name = full_name;

            /** Update service.loans.data */
            angular.forEach(this.service.loans.data, data => {
              if (data.Patron.id === id) {
                data.Patron.full_name = full_name;
              }
            });
          }
        });
    }

    del(id, category) {

      if (!this.service[category].del) {
        throw new Error(`${category} category does not contain a delete method`);
      }

      return this.service[category].del(id)
        .then(resp => {
          const index = this.service[category].data.findIndex(data => data.id === id);
          
          this.service[category].data.splice(index, 1);

          if (category === 'books') {
            /** Update service.titles.data */
            const index = this.service.titles.data.findIndex(data => data.id === id);

            this.service.titles.data.splice(index, 1);
            
            /** Update service.loans.data */
            this.service.loans.data = this.service.loans.data.filter(data => data.book_id !== id);
          }

          /** Update books availablity */
          if (category === 'loans') {
            this.returnBook(resp.data.book_id);
          }

          if (category === 'patrons') {
            /** Update service.patronNames.data */
            this.service.patronNames.data = this.service.patronNames.data.filter(data => data.id !== id);

            /** Update service.loans.data */
            this.service.loans.data = this.service.loans.data.filter(data => data.Patron.id !== id);
          }
        });
    }
  }
  return new Data();
}
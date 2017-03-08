// angular
//   .module('slim')
//   .service('Data', Data);

// Data.$inject = ['Api'];

// function Data(Api) {

//   function Data() {

//     const service = {};

//     /** Set new category */
//     this.set = function(categories) {
//     	angular.forEach(categories, function(category) {
//       	service[category.name] = {};
        
//         const categoryObject = service[category.name];
        
//         categoryObject.watchers = [];
//         categoryObject.data = [];

//         if (category.post) {
//           categoryObject.post = category.post;
//         }

//         if (category.put) {
//           categoryObject.put = category.put;
//         }

//         if (category.del) {
//           categoryObject.del = category.del;
//         }
        
//         Object.defineProperty(categoryObject, data, {
//           get: function() {
//           	return categoryObject.data;
//           },
//           set: function(arr) {
//             if(!angular.isArray(arr)) {
//               throw new Error('category must be an array');
//             }
//             categoryObject.data = arr;
//             angular.forEach(categoryObject.watchers, function(watcher) {
//             	watcher = arr;
//             });
//           }
//         });

//         category.get
//           .then(function(resp) {
//             if (category.name === 'loans') {
//               resp.data = strDateToObj(resp.data);
//             }
//             categoryObject.data = resp.data;
//           })
//           .catch(function(error) {
//             categoryObject.data = ['timeout'];
//           });
//       });
//     };

//     this.watch = function(scope, categories) {
//       if(!angular.isArray(categories)) {
//         throw new Error('Data.watch method require array of categories to watch on.');
//       }

//       angular.forEach(categories, function(category) {
//         if (!angular.isObject(service[category])) {
//           throw new Error(`Invalid category name! ${category} is not an object.`);
//         }

//         Object.defineProperty(scope, category, {
//           get: function() {
//             return service[category].data;
//           },
//           set: function(arr) {
//             if(!angular.isArray(arr)) {
//               throw new Error('Category must be an array');
//             }
//             service[category].data = arr;
//           }
//         });

//         service[category].watchers.push(scope[category]);
//       });
//     };

//     this.unwatch = function(scope, categories) {
//       if(!angular.isArray(categories)) {
//         throw new Error('Data.unwatch method require array of categories to watch on.');
//       }

//       angular.forEach(categories, function(category) {
//         if (!angular.isObject(service[category])) {
//           throw new Error(`Invalid category name! ${category} is not an object.`);
//         }

//         const index = service[category].watchers.indexOf(scope[category]);

//         service[category].watchers.splice(index, 1);
//       });
//     };

//     this.post = function(data, category) {
//       if (!service[category].post) {
//         throw new Error(`${category} category does not contain a post method`);
//       }

//       return service[category].post(data)
//         .then(function(resp) {
//           if (category === 'loans') {
//             resp.data = strDateToObj(resp.data);
//           }
//           service[category].data.push(resp.data);

//           // Update service.titles.data
//           if (category === 'books') {
//             const title = {
//               id: resp.data.id,
//               title: resp.data.title,
//               available: resp.data.available
//             };
//             service.titles.data.push(title);
//           }

//           // Update books availablity
//           if (category === 'loans') {
//             borrowBook(data.book_id);
//           }

//           // Update service.patronNames
//           if (category === 'patrons') {
//             const patron = {
//               id: resp.data.id,
//               full_name: `${resp.data.first_name} ${resp.data.last_name}`
//             }
//             service.patronNames.data.push(patron);
//           }
//         })
//         .catch(function(error) {
//           throw new Error(error);
//         });
//     };

//     this.put = function(id, data, category, adjust) {
//       if (!service[category].put) {
//         throw new Error(`${category} category does not contain a put method`);
//       }

//       return service[category].put(id, data)
//         .then(function(resp) {
//           if (category === 'loans') {
//             resp.data = strDateToObj(resp.data);
//           }
//           for(let i = 0; i < service[category].data.length; i++) {
//             let data = service[category].data[i];

//             if (data.id === resp.data.id) {
//               angular.extend(data,resp.data);

//               if (category === 'books' && adjust) {
//                 // Update service.titles.data
//                 for (let i = 0; i < service.titles.data.length; i++) {
//                   let data = service.titles.data[i];
                  
//                   if (data.id === resp.data.id) {
//                     const title = {
//                       id: resp.data.id,
//                       title: resp.data.title,
//                       available: resp.data.available
//                     }
//                     angular.extend(data, title);
//                     break;
//                   }
//                 }

//                 // Update service.loans.data
//                 angular.forEach(service.loans.data, function(data) {
//                   if (data.Book.id === id) {
//                     data.Book.title = resp.data.title;
//                   }
//                 });
//               }
              
//               // Update books availablity
//               if (category === 'loans' && adjust) {
//                 returnBook(adjust);
//                 borrowBook(resp.data.book_id);
//               }

//               if (category === 'patrons' && adjust) {
//                 const full_name = `${resp.data.first_name} ${resp.data.last_name}`

//                 // Update service.patronNames.data
//                 for (let i = 0; i < service.patronNames.data.length; i++) {
//                   const data = service.patronNames.data[i];

//                   if (data.id === id) {
//                     data.full_name = full_name;
//                     break;
//                   }
//                 }

//                 // Update service.loans.data
//                 angular.forEach(service.loans.data, function(data, index) {
//                   if (data.Patron.id === id) {
//                     data.Patron.full_name = full_name;
//                   }
//                 });
//               }
//               break;
//             }
//           }
//         });
//     };

//     this.del = function(id, category) {
//       if (!service[category].del) {
//         throw new Error(`${category} category does not contain a delete method`);
//       }

//       return service[category].del(id)
//         .then(function(resp) {
//           for(let i = 0; i < service[category].data.length; i++) {
//             const data = service[category].data[i];

//             if (data.id === id) {
//               service[category].data.splice(i, 1);

//               if (category === 'books') {
//                 // Update service.titles.data
//                 for (let i = 0; i < service.titles.data.length; i++) {
//                   const data = service.titles.data[i];
//                   if(data.id === id) {
//                     service.titles.data.splice(i, 1);
//                     break;
//                   }
//                 }

//                 // Update service.loans.data
//                 service.loans.data = service.loans.data.filter(function(data) {
//                   if (data.book_id !== id) {
//                     return data;
//                   }
//                 });
//               }

//               // Update books availablity
//               if (category === 'loans') {
//                 returnBook(resp.data.book_id);
//               }

//               if (category === 'patrons') {
//                 // Update service.patronNames.data
//                 service.patronNames.data = service.patronNames.data.filter(function(data) {
//                   if (data.id !== id) {
//                     return data;
//                   }
//                 });

//                 // Update service.loans.data
//                 service.loans.data = service.loans.data.filter(function(data) {
//                   if (data.Patron.id !== id) {
//                     return data;
//                   }
//                 });
//               }
//               break;
//             }
//           }
//         });
//     };

//     /**
//      * Helpers Functions
//      */

//     function strDateToObj(data) {
//       if (angular.isArray(data)) {
//         return data.map(function (loan) {
//           loan.loaned_on = new Date(loan.loaned_on);
//           loan.return_by = new Date(loan.return_by);
//           if (loan.returned_on) {
//             loan.returned_on = new Date(loan.returned_on);
//           }
//           return loan;
//         });
//       }
//       // if it's object
//       else if (angular.isObject(data)){
//         data.loaned_on = new Date(data.loaned_on);
//         data.return_by = new Date(data.return_by);
//         if (data.returned_on) {
//           data.returned_on = new Date(data.returned_on);
//         }
//         return data;
//       }
//     }

//     function borrowBook(id) {
//       const categories = [service.titles, service.books];

//       angular.forEach(categories, function(category) {
//         for (let i = 0; i < category.data.length; i++) {
//           const data = category.data[i];
//           if (data.id === id) {
//             data.available -= 1;
//             break;
//           }
//         }
//       });
//     }

//     function returnBook(id) {
//       const categories = [service.titles, service.books];

//       angular.forEach(categories, function(category) {
//         for (let i = 0; i < category.data.length; i++) {
//           const data = category.data[i];
//           if (data.id === id) {
//             data.available += 1;
//             break;
//           }
//         }
//       });
//     }
//   }

//   const data = new Data();

//   return data;
// }
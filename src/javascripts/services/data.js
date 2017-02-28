angular
  .module('slim')
  .service('Data', Data);

Data.$inject = ['Api'];

function Data(Api) {

  /**
   * Service object
   */

  const service = {
    set: set,
    post: post,
    put: put,
    del: del,
    subscribe: subscribe,
    unsubscribe: unsubscribe
  };

  return service;

  /**
   * Handlers functions
   */

  function set(objects) {
    angular.forEach(objects, function(object) {
      service[object.category] = {};

      const category = service[object.category];

      category.subscribers = [];
      category.data = ['loading'];

      if (object.post) {
        category.post = object.post;
      }

      if (object.put) {
        category.put = object.put;
      }

      if (object.del) {
        category.del = object.del;
      }

      object.promise
        .then(function(resp) {
          if (object.category === 'loans') {
            resp.data = strDateToObj(resp.data);
          }
          angular.extend(category.data, resp.data);
          notify(object.category);
        })
        .catch(function(error) {
          category.data = ['timeout'];
          notify(object.category);
        })
    });
  }

  function post(data, category) {
    if (!service[category].post) {
      throw new Error(`The ${category} category does not contain a post method`);
    }

    return service[category].post(data)
      .then(function(resp) {
        if (category === 'loans') {
          resp.data = strDateToObj(resp.data);
        }
        service[category].data.push(resp.data);
        notify(category);

        // Update service.titles.data
        if (category === 'books') {
          const title = {
            id: resp.data.id,
            title: resp.data.title,
            available: resp.data.available
          };
          service.titles.data.push(title);
          notify('titles');
        }

        // Update books availablity
        if (category === 'loans') {
          borrowBook(data.book_id);
        }

        // Update service.patronNames
        if (category === 'patrons') {
          const patron = {
            id: resp.data.id,
            full_name: `${resp.data.first_name} ${resp.data.last_name}`
          }
          service.patronNames.data.push(patron);
          notify('patronNames');
        }
      })
      .catch(function(error) {
        throw new Error(error);
      });
  }

  function put(id, data, category, adjust) {
    if (!service[category].put) {
      throw new Error(`The ${category} category does not contain a put method`);
    }

    return service[category].put(id, data)
      .then(function(resp) {
        if (category === 'loans') {
          resp.data = strDateToObj(resp.data);
        }
        for(let i = 0; i < service[category].data.length; i++) {
          const data = service[category].data[i];

          if (data.id === resp.data.id) {
            angular.extend(data, resp.data);
            notify(category);

            if (category === 'books' && adjust) {
              // Update service.titles.data
              for (let i = 0; i < service.titles.data.length; i++) {
                const data = service.titles.data[i];

                if (data.id === resp.data.id) {
                  angular.extend(data, resp.data);
                  notify('titles');
                  break;
                }
              }

              // Update service.loans.data
              angular.forEach(service.loans.data, function(data) {
                if (data.Book.id === id) {
                 data.Book.title = resp.data.title;
                }
              });
              notify('loans');
            }
            
            // Update books availablity
            if (category === 'loans' && adjust) {
              returnBook(adjust);
              borrowBook(resp.data.book_id);
            }

            if (category === 'patrons' && adjust) {
              const full_name = `${resp.data.first_name} ${resp.data.last_name}`

              // Update service.patronNames.data
              for (let i = 0; i < service.patronNames.data.length; i++) {
                const data = service.patronNames.data[i];
                if (data.id === id) {
                  data.full_name = full_name;
                  notify('patronNames');
                  break;
                }
              }

              // Update service.loans.data
              angular.forEach(service.loans.data, function(data, index) {
                if (data.Patron.id === id) {
                 data.Patron.full_name = full_name;
                }
              });
              notify('loans');
            }
            break;
          }
        }
      });
  }

  function del(id, category) {
    if (!service[category].del) {
      throw new Error(`The ${category} category does not contain a delete method`);
    }

    return service[category].del(id)
      .then(function(resp) {
        for(let i = 0; i < service[category].data.length; i++) {
          const data = service[category].data[i];

          if (data.id === id) {
            service[category].data.splice(i, 1);

            // remove the data from each subscriber.
            angular.forEach(service[category].subscribers, function(data) {
              data.splice(i, 1);
            });

            if (category === 'books') {
              // Update service.titles.data
              for (let i = 0; i < service.titles.data.length; i++) {
                const data = service.titles.data[i];
                if(data.id === id) {
                  service.titles.data.splice(i, 1);
                  break;
                }
              }
              notify('titles');

              // Update service.loans.data
              service.loans.data = service.loans.data.filter(function(data) {
                if (data.book_id !== id) {
                  return data;
                }
              })
              notify('loans');
            }

            // Update books availablity
            if (category === 'loans') {
              returnBook(resp.data.book_id);
            }

            if (category === 'patrons') {
              // Update service.patronNames.data
              service.patronNames.data = service.patronNames.data.filter(function(data) {
                if (data.id !== id) {
                  return data;
                }
              });
              notify('patronNames');

              // Update service.loans.data
              service.loans.data = service.loans.data.filter(function(data) {
                if (data.Patron.id !== id) {
                  return data;
                }
              });
              notify('loans');
            }
            break;
          }
        }
      });
  }

  function strDateToObj(data) {
    // if it's array
    if (angular.isArray(data)) {
      return data.map(function (loan) {
        loan.loaned_on = new Date(loan.loaned_on);
        loan.return_by = new Date(loan.return_by);
        if (loan.returned_on) {
          loan.returned_on = new Date(loan.returned_on);
        }
        return loan;
      });
    }
    // if it's object
    else if(angular.isObject(data)){
      data.loaned_on = new Date(data.loaned_on);
      data.return_by = new Date(data.return_by);
      if (data.returned_on) {
        data.returned_on = new Date(data.returned_on);
      }
      return data;
    }
  }

  function borrowBook(id) {
    const categories = [service.titles, service.books];

    angular.forEach(categories, function(category) {
      for(let i = 0; i < category.data.length; i++) {
        const data = category.data[i];
        if (data.id === id) {
          data.available -= 1;
          notify(category);
          break;
        }
      }
    });
  }

  function returnBook(id) {
    const categories = [service.titles, service.books];

    angular.forEach(categories, function(category) {
      for(let i = 0; i < category.data.length; i++) {
        const data = category.data[i];
        if (data.id === id) {
          data.available += 1;
          notify(category);
          break;
        }
      }
    });
  }


  /**
   * Subscribers managment functions
   */

  function subscribe(scope, categories) {
    angular.forEach(categories, function(category) {
      const propertyName = `${category}List`;
      const data = service[category].data;
      
      scope[propertyName] = [];
      
      service[category].subscribers.push(scope[propertyName]);
      angular.extend(scope[propertyName], data);
    });
  }

  function unsubscribe(scope, categories) {
    angular.forEach(categories, function(category) {
      const propertyName = `${category}List`;
      const index = service[category].subscribers.indexOf(scope[propertyName]);

      service[category].subscribers.splice(index, 1);
    });
  }

  function notify(category) {
    const subscribers = angular.isString(category) ? service[category].subscribers : category.subscribers;
    const data = angular.isString(category) ? service[category].data : category.data;

    angular.forEach(subscribers, function(subscriber) {
      if(data.length < subscriber.length) {
        angular.copy(data, subscriber);
      }
      else {
        angular.extend(subscriber, data);
      }
    });
  }
}
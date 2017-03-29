## SLIM

![screen](https://cloud.githubusercontent.com/assets/19666213/20004269/f4b4cde2-a293-11e6-8254-0688d7fd96ce.jpg)

SLIM is a single page library management system for small libraries with fresh and clean design.

### Features
* Add/Edit/Delete Books
* Add/Edit/Delete Patrons
* Add/Edit/Delete Loans
* Add New Authors
* Add New Genres
* Sort/Filter Data
* And Many More...

### Tech

SLIM uses a number of open source projects:
* [node.js](http://nodejs.org/) - duh!
* [Express](https://github.com/expressjs/express) - Fast, unopinionated, minimalist web framework for node.
* [AngularJS](https://github.com/angular/angular.js) - HTML enhanced for web apps!
* [Bootstrap](https://github.com/twbs/bootstrap) - The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web.
* [SQLite3](https://github.com/mapbox/node-sqlite3) - Asynchronous, non-blocking SQLite3 bindings for Node.js.
* [Sequelize](https://github.com/sequelize/sequelize) - An easy-to-use multi SQL dialect ORM for Node.js.
* [noty](https://github.com/needim/noty) - A jQuery Notification Plugin.

### Installation

```
$ git clone https://github.com/Liad91/slim.git
$ cd slim
$ npm install
$ bower install
```

### Build the dist folder

```
$ gulp
```

### Run and build the database

```
$ npm start
```

### Seed the database

```
$ node_modules\.bin\sequelize db:seed:all
```

### Login
```
username: admin
password: admin
```

### License

MIT

***Free Software, Hell Yeah!***

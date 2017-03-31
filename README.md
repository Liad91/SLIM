# SLIM

SLIM is a single page library management system for small libraries AngularJS powered with a modern, clean design based on the popular Bootstrap framework v4.

![slim-screenshot](https://cloud.githubusercontent.com/assets/19666213/24549426/e10aeb44-1621-11e7-9465-428bc42e8292.png)

### Features
* Add / Edit / Delete Books
* Add / Edit / Delete Patrons
* Add / Edit / Delete Loans
* Add New Authors
* Add New Genres
* Sort / Filter Data
* And Many More...

### Tech
* [node.js](https://nodejs.org) - evented I/O for the backend
* [Express](http://expressjs.com) - fast node.js network app framework
* [Gulp](https://github.com/gulpjs/gulp) - the streaming build system
* [AngularJS](https://github.com/angular/angular.js) - HTML enhanced for web apps!
* [Twitter Bootstrap](https://github.com/twbs/bootstrap) - great UI boilerplate for modern web apps.
* [SQLite3](https://github.com/mapbox/node-sqlite3) - Asynchronous, non-blocking SQLite3 bindings for Node.js.
* [Sequelize](https://github.com/sequelize/sequelize) - An easy-to-use multi SQL dialect ORM for Node.js.
* [noty](https://github.com/needim/noty) - A jQuery Notification Plugin.

### Installation

```sh
$ git clone https://github.com/Liad91/slim.git
$ cd slim
$ npm install
$ bower install
```

### Build the dist folder

#### For production release:
linux / os
```sh
$ set node_env=production gulp
```
windows
```
$ npm run win_build_production
```

#### For development:
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

### Todo
 - write unit tests


### License

MIT

***Free Software, Hell Yeah!***

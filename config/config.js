var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

var config = {
  root: rootPath,
  port: 3000,
  mysql: {
    host: '',
    username: '',
    password: '',
    database: '',
  },
  view: {
    page: 10
  }
};

module.exports = config;

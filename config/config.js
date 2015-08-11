var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

var config = {
  root: rootPath,
  port: 3333,
  mysql: {
    host: 'test4592db.cajptrrlss3n.ap-northeast-1.rds.amazonaws.com',
    username: 'test4592',
    password: '12341234',
    database: 'blog-test'
  },
  view: {
    page: 10
  }
};

module.exports = config;

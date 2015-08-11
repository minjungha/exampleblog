var path = require('path');
var Sequelize = require('sequelize');
var config = require('./../../config/config.js');
var db = {};
var glob = require('glob');
var cls = require('continuation-local-storage');
var namespace = cls.createNamespace('Blog');

Sequelize.cls = namespace;

var sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host: config.mysql.host,
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
});

var files = glob.sync(__dirname + '/*.js');
files.filter(function(file) {
  var s = file.split(path.sep);
  var filename = s[s.length-1];
  return (file.indexOf('.') !== 0) && (filename !== 'index.js');
}).forEach(function(file) {
  console.log(file);
  var model = sequelize['import'](file);
  db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

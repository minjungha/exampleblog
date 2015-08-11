var express = require('express');
var config = require('./config/config.js');
var http = require('http');
var glob = require('glob');
var db = require('./app/models');

var app = express();
var server = http.createServer(app);

require('./config/express.js')(app, config);

db.sequelize.sync({force: false}).then(function() {
  var initializers = glob.sync(config.root + '/app/initializers/**/*.js');
  initializers.forEach(function(initializer) {
    require(initializer)();
  });
  server.listen(config.port);
}).catch(function(err) {
  throw new Error(err);
});


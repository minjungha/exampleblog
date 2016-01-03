var express = require('express');
var logger = require('morgan');
var glob = require('glob');
var favicon = require('serve-favicon');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var multer = require('multer');
var redis = require('redis');
var redisStore = require('connect-redis')(session);

module.exports = function(app, config) {

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';
  app.locals.ENV_PRODUCTION = env === 'production';

  app.use(favicon(config.root + '/public/img/favicon.ico'));

  app.use('/uploads', express.static(config.root + '/uploads'));


  app.use(multer({dest:'./uploads/'}).single('photo'));

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(expressValidator());
  app.use(cookieParser('qwopqfvoisjv1231pjasd3'));

  var client = redis.createClient();

  app.use(session({
    secret: 'abzxcspduagadonb3341',
    store: new redisStore({
      host: 'localhost',
      port: 6379,
      client: client,
      ttl: 60*60*24*3,
      prefix: 'blog:session:'
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000*60*60*24
    }
  }));

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  require('./passport.js')();

  app.use(function(req, res, next) {
    if (req.user) {
      req.session.touch();
      res.locals.user = req.user;
    } else {
      res.locals.user = null;
    }
    next();
  });

  app.use('/assets', express.static(config.root + '/public'));
  if (env === 'development') {
    app.disable('view cache');
  }


  var controllers = glob.sync(config.root + '/app/controllers/**/*.js');
  controllers.forEach(function(controller) {
    require(controller)(app);
  });

  app.use('/*', function(req, res, next) {
    res.header('X-XSS-Protection' , 0 );
    next();
  });

  app.use(function(req, res, next) {
    var err = new Error('404 not found');
    err.status = 404;
    next(err);
  });
};



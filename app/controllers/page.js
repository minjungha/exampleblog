var express = require('express');
var router = express.Router();
var db = require('./../models');
var Post = db.Post;
var config = require('./../../config/config.js');

module.exports = function(app) {
  app.use('/', router);
};

router.param('page', function(req, res, next, page) {
  req.check('page', 'Invalid parameter').notEmpty().isInt();

  var errors = req.validationErrors();

  if (errors) {
    res.sendStatus(403);
  } else {
    next();
  }
});


router.get('/page', function(req, res, next) {
  res.redirect('/page/1');
});

router.get('/page/:page', function(req, res, next) {
  var page = req.params.page;

  Post.findAll({
    limit: config.view.page,
    offset: config.view.page * (page-1),
    order: 'id DESC'
  }).then(function(posts) {
    if (posts) {
      res.render('page', {posts: posts});
    } else {
      res.sendStatus(404);
    }
  }).catch(function(err) {
    next(err);
  });
});
  

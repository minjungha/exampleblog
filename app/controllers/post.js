var express = require('express');
var router = express.Router();
var db = require('../models');
var Post = db.Post;
var Promise = require('bluebird');
var moment = require('moment');

module.exports = function(app) {
  app.use('/', router);
};

router.param('postId', function(req, res, next, postId) {
  req.check('postId', 'Invalid parameter').notEmpty().isInt();

  var errors = req.validationErrors();

  if (errors) {
    res.sendStatus(403);
  } else {
    next();
  }
});

router.get('/posts', function(req, res, next) {
  Post.findAll({raw: true}).then(function(posts) {
    posts.reverse();
    if (posts) {
      return Promise.map(posts, function(post){
        post.updatedAt = moment(post.updatedAt).format('YYYY.MM.DD');
      }).then(function() {
        res.render('posts', {
          posts: posts
        });
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.route('/posts/delete').all(function(req, res, next) {
  if (!req.user) {
    return res.redirect('/');
  }
  next();
}).post(function(req, res, next) {
  var id = req.body.id;
  Post.findById(id).then(function(post) {
 /*   if (post.UserId !== req.user.id) {
      res.redirect('/');
      return;
    } */

    return post.update({
      visible: false
    });
  }).then(function() {
    res.redirect('/');
  }).catch(function(err) {
    next(err);
  });
});

router.route('/posts/edit').all(function(req, res, next) {
  if (!req.user) {
    return res.redirect('/');
  }
  next();
}).post(function(req, res, next) {
  var id = req.body.id;
  Post.findById(id).then(function(post) {
    /*
    if (post.UserId !== req.user.id) {
      res.redirect('/');
      return;
    }*/
    req.flash('post-title', post.title);
    req.flash('post-content', post.content);
    req.flash('post-id', post.id);
    res.redirect('/write');
  }).catch(function(err) {
    next(err);
  });
});



router.get('/post/:postId', function(req, res, next) {
  var postId = req.params.postId;

  Post.findById(postId).then(function(post) {
    if (post) {
      post.updatedAt = post.updatedAt.toString();
      res.render('post', {
        post: post
      });
    } else {
      res.sendStatus(404);
    }
  }).catch(function(err) {
    next(err);
  });
});


var express = require('express');
var router = express.Router();
var db = require('../models');
var Post = db.Post;

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
  Post.findAll().then(function(posts) {
    posts.reverse();
    if (posts) {
      res.render('posts', {
        posts: posts
      });
    } else {
      res.sendStatus(404);
    }
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
  

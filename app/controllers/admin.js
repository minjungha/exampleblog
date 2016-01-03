var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('./../models');
var User = db.User;
var Image = db.Image;
var Post = db.Post;
var TempPost = db.TempPost;
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));

module.exports = function(app) {
  app.use('/', router);
};

router.route('/admin').all(function(req, res, next) {
  if (req.user) {
    res.redirect('/posts');
    //res.redirect('/write');
    return;
  }
  next();
}).get(function(req, res, next) {
  var msg = req.flash('login-failed');
  res.render('admin', {
    msg: msg
  });
}).post(passport.authenticate('local', {
  failureRedirect: '/admin'
}), function(req, res, next) {
  res.redirect('/admin');
});

router.route('/write').all(function(req, res, next) {
  if (!req.user) {
    res.sendStatus('404');
    return;
  }
  next();
}).get(function(req, res, next) {
  var title = req.flash('post-title')[0] || null;
  var content = req.flash('post-content')[0] || null;
  var postId = req.flash('post-id')[0] || null;
  req.user.getTempPost().then(function(tempPost) {
    if (title || content) {
      Promise.resolve().then(function() {
        if (tempPost) {
          return tempPost.update({
            title: title,
            content: content
          });
        } else {
          return TempPost.create({
            title: title,
            content: content,
            UserId: req.user.id
          });
        }
      }).then(function() {
        res.render('write', {
          tempPostTitle: title,
          tempPostContent: content,
          edit: true,
          postId: postId
        });
      });
    } else if (tempPost) {
      res.render('write', {
        tempPostTitle: tempPost.title,
        tempPostContent: tempPost.content
      });
    } else {
      res.render('write');
    }
  }).catch(function(err) {
    next(err);
  });
}).put(function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  req.user.getTempPost().then(function(tempPost) {
    if (tempPost) {
      return tempPost.update({
        title: title,
        content: content
      });
    } else {
      return TempPost.create({
        title: title,
        content: content,
        UserId: req.user.id
      });
    }
  }).then(function(tempPost) {
    return res.end();
  }).catch(function(err) {
    next(err);
  });
}).post(function(req, res ,next) {
  var title = req.body.title;
  var content = req.body.content;
  var postImages = req.body.images;

  req.user.getTempPost().bind({}).then(function(tempPost) {
    if (tempPost) {
      return tempPost.update({
        title: title,
        content: content
      });
    } else {
      return TempPost.create({
        title: title,
        content: content,
        UserId: req.user.id
      });
    }
  }).then(function(tempPost) {
    this.tempPost = tempPost;
    return tempPost.getImages();
  }).then(function(images) {
    if (postImages) {
      return Promise.map(images, function(image) {
        if (!(image.path in pmages)) {
          var path = image.path;
          return Promise.all([
            image.destroy(),
            fs.unlinkAsync(__dirname+'/../../' + path)
          ]);
        }
      });
    } else {
      return;
    }
  }).then(function() {
    return Post.create({
      title: this.tempPost.title,
      content: this.tempPost.content,
      UserId: req.user.id
    });
  }).then(function(post) {
    this.post = post;
    return this.tempPost.getImages();
  }).then(function(images) {
    var postId = this.post.id;
    return Promise.map(images, function(image) {
      return image.update({
        postId: postId,
        TempPostId: null
      });
    });
  }).then(function() {
    return this.tempPost.destroy();
  }).then(function() {
    res.redirect('/posts');
    //res.redirect('/post/' + this.post.id);
  }).catch(function(err) {
    next(err);
  });
});

router.route('/edit').all(function(req, res, next) {
  if (!req.user) {
    return res.sendStatus(404);
  }
  next();
}).post(function(req, res, next) {
  var id = req.body.id;
  var title = req.body.title;
  var content = req.body.content;
  var postImages = req.body.images;

  Post.findById(id).bind({}).then(function(post) {
    if (! post) {
      return res.redirect('/');
    }
    this.post = post;
    /*
    if (req.user.id !== post.UserId) {
      return res.redirect('/');
    }*/
    return req.user.getTempPost();
  }).then(function(tempPost) {
    if (tempPost) {
      return tempPost.update({
        title: title,
        content: content
      });
    } else {
      return TempPost.create({
        title: title,
        content: content,
        UserId: req.user.id
      });
    }
  }).then(function(tempPost) {
    this.tempPost = tempPost;
    return tempPost.getImages();
  }).then(function(images) {
    if (postImages) {
      return Promise.map(images, function(image) {
        if (!(image.path in pmages)) {
          var path = image.path;
          return Promise.all([
            image.destroy(),
            fs.unlinkAsync(__dirname+'/../../' + path)
          ]);
        }
      });
    } else {
      return;
    }
  }).then(function() {
    return this.post.update({
      title: this.tempPost.title,
      content: this.tempPost.content,
    });
  }).then(function(post) {
    this.post = post;
    return this.tempPost.getImages();
  }).then(function(images) {
    var postId = this.post.id;
    return Promise.map(images, function(image) {
      return image.update({
        postId: postId,
        TempPostId: null
      });
    });
  }).then(function() {
    return this.tempPost.destroy();
  }).then(function() {
    res.redirect('/posts');
    //res.redirect('/post/' + this.post.id);
  }).catch(function(err) {
    next(err);
  });
});

router.route('/upload').all(function(req, res, next) {
  if (!req.user) {
    res.sendStatus(404);
    return ;
  }
  next();
}).post(function(req, res, next) {
  var path = '/' + req.file.path;

  req.user.getTempPost().then(function(tempPost) {
    if (tempPost) {
      return Image.create({
        path: path,
        TempPostId: tempPost.id,
        UserId: req.user.id
      }).then(function() {
        res.json({url: path});
      });
    } else {
      return res.json({});
    }
  }).catch(function(err) {
    next(err);
  });
});

router.route('/logout').all(function(req, res, next) {
  if (!req.user) {
    return res.sendStatus(404);
  }
  next();
}).post(function(req, res, next) {
  req.logout();
  res.redirect('/');
});

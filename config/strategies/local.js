var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./../../app/models');
var User = db.User;

module.exports = function() {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    var loginFailed = function(done) {
      req.flash('login-failed', '아이디가 존재하지 않거나 비밀번호가 다릅니다');
      done(null, false);
    };

    User.findOne({
      where: {
        username: username
      }
    }).then(function(user) {
      if (user) {
        if (user.validPassword(password)) {
          return done(null, user);
        } else {
          loginFailed(done);
        }
      } else {
        loginFailed(done);
      }
    }).catch(function(err) {
      return done(err);
    });
  }));
};


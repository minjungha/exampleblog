var passport = require('passport');
var db = require('./../app/models');
var User = db.User;

module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(userid, done) {
    User.findById(userid).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err, null);
    });
  });

  require('./strategies/local.js')();
};

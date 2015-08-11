var db = require('./../models');
var User = db.User;

module.exports = function() {
  User.count().then(function(count) {
    if (count !== 0) {
      return;
    }
    var user = {
      username: 'test',
      password: 'test',
      displayName: 'test'
    };

    User.create(user).catch(function(err) {
      throw new Error(err);
    });
  });
};

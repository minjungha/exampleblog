var args = process.argv;
args = args.slice(2);

if (args.length !==0) {
  console.log('Usage: node list.js');
  return;
}

var db = require('./../app/models');
var User = db.User;

User.findAll({
}).then(function(users) {
  if (users && users[0]) {
    users.forEach(function(user) {
      console.log('[' + user.username + ']');
    });
  } else {
    console.log('There are no users');
  }
}).catch(function(err) {
  console.error(err);
  throw err;
});


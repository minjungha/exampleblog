var args = process.argv;
args = args.slice(2);

if (args.length !==2) {
  console.log('Usage: node register.js [id] [password]');
  return;
}


var db = require('./../app/models');
var User = db.User;
var username = args[0];
var password = args[1];

User.create({
  username: username,
  password: password
}).then(function(user) {
  console.log('register success\nid : ' + username + '\npassword : ' + password);
}).catch(function(err) {
  if (err.name === 'SequelizeValidationError') {
    console.log('register fail.\n[' + username + '] is already exist?');
  }
});


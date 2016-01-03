var args = process.argv;
args = args.slice(2);

if (args.length !==1) {
  console.log('Usage: node delete.js [id]');
  return;
}

var db = require('./../app/models');
var User = db.User;
var username = args[0];

User.findOne({
  where: {
    username: username,
  }
}).then(function(user) {
  if (user) {
    return User.destroy({
      where: {
        username: username,
      }
    });
  } else {
    console.log('아이디가 존재하지 않습니다.');
    return null;
  }
}).then(function(user) {
  if (user) {
    console.log('[' + username + ']가 삭제되었습니다.');
  }
}).catch(function(err) {
  if (err) {
    console.error(err);
    throw err;
  }
});

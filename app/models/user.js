var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(20),
      unique: {
        msg: '이미 존재하는 아이디 입니다'
      },
      validate: {
        len: {
          args: [3, 20],
          msg: '아이디는 3글자 이상, 20글자 이하 입니다'
        }
      }
    },
    displayName: {
      type: DataTypes.STRING(20),
      unique: {
        msg: '이미 존재하는 이름 입니다'
      },
      validate: {
        len: {
          args: [3, 20],
          msg: '이름은 3글자 이상, 20글자 이하 입니다'
        }
      }
    },
    password: {
      type: DataTypes.STRING(88),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: '비밀번호를 입력해 주세요'
        }
      }
    },
    salt: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: ''
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasOne(models.TempPost);
        User.hasMany(models.Post);
        User.hasOne(models.Image);
      }
    },
    instanceMethods: {
      hashPassword: function(password) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(password);
        password = md5sum.digest('hex');
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
      },
      validPassword: function(password) {
        return this.password === this.hashPassword(password);
      }
    }
  });

  User.beforeCreate(function(user, options, next) {
    user.salt = crypto.randomBytes(16).toString('base64');
    user.password = user.hashPassword(user.password);
    next(null, user);
  });

  return User;
};


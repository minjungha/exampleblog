module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: '제목을 입력해 주세요'
        },
        max: {
          args: 100,
          msg: '제목은 100글자 이하만 가능합니다'
        }
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: '내용을 입력해 주세요'
      },
      validate: {
        max: {
          args: 65000,
          msg: '내용은 65000글자 이하만 가능합니다'
        }
      }
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    defaultScope: {
      where: {
        visible: true
      }
    },
    classMethods: {
      associate: function(models) {
        Post.belongsTo(models.User);
        Post.hasMany(models.Image);
      }
    }
  });
  return Post;
};


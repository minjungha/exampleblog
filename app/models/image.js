module.exports = function(sequelize, DataTypes) {
  var Image = sequelize.define('Image', {
    path: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Image.belongsTo(models.Post);
        Image.belongsTo(models.TempPost);
        Image.belongsTo(models.User);
      }
    }
  });

  return Image;
};

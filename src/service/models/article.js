'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullText: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: `Article`,
      tableName: `articles`,
    },
);

module.exports = define;

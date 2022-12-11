'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comment.init({
    text: Sequelize.STRING,
    homePage: Sequelize.STRING,
    userId: {
      type: Sequelize.INTEGER,
    },
    commentId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      },
    },
    fileUrl: Sequelize.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
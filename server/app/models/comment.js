'use strict';
const {
  Model
} = require('sequelize');
const {User} = require('./user');
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
    userId: Sequelize.INTEGER,
    commentId: Sequelize.INTEGER,
    fileUrl: Sequelize.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
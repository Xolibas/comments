'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('Comments', {
      fields: ['commentId'],
      type: 'foreign key',
      name: 'comment_comment_association',
      references: {
        table: "Comments",
        field: "id"
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint('Comments', {
      fields: ['commentId'],
      type: 'foreign key',
      name: 'comment_comment_association',
      references: {
        table: "Comments",
        field: "id"
      }
    })
  }
};

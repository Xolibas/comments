'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('Comments', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'comment_user_association',
      references: {
        table: "Users",
        field: "id"
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint('Comments', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'comment_user_association',
      references: {
        table: "Users",
        field: "id"
      }
    })
  }
};

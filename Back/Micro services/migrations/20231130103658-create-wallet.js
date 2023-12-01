'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wallets', {
      userUid: {
        type: DataTypes.UUID,  // Assurez-vous que le type correspond à celui de la table Users
        references: {
          model: 'Users',
          key: 'uid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      cardName: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.STRING,
        type: Sequelize.STRING
      },
      cardNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cvv: {
        allowNull: false,
        type: Sequelize.STRING
      },
      expirationDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Wallets');
  }
};
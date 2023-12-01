'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Wallet.init({
    cardName: DataTypes.STRING,
    cardNumber: DataTypes.STRING,
    cvv: DataTypes.STRING,
    expirationDate: DataTypes.DATE,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  Wallet.belongsTo(User, { foreignKey: 'uid' });
  return Wallet;
};
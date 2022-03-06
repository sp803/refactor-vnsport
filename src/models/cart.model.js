const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./db-connection');

class Cart extends Model {}

Cart.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'Cart',
    timestamps: false,
  }
);

module.exports = Cart;

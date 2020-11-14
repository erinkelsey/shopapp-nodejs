const Sequelize = require('sequelize').Sequelize

const sequelize = require('../util/database')

/**
 * Sequelize model for a single cart.
 */
const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
}) 

module.exports = Cart 
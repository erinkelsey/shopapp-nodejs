const Sequelize = require('sequelize').Sequelize

const sequelize = require('../util/database')

/**
 * Sequelize model for a single user.
 */
const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING
}) 

module.exports = User 
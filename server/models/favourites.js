const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Users = require('./users');
const Recipes = require('./recipes');

const Favourites = sequelize.define('favourites', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id',
    },
  },
  recipeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Recipes,
      key: 'id',
    },
  },
});


module.exports = Favourites;

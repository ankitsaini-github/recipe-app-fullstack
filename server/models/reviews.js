const Sequelize = require('sequelize');

const sequelize = require('../utils/database');
const Users = require('./users');
const Recipes = require('./recipes')

const Reviews = sequelize.define('reviews', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references:{
      model: Users,
      key: 'id'
    }
  },
  recipeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references:{
      model: Recipes,
      key: 'id'
    }
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  comment: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Reviews;
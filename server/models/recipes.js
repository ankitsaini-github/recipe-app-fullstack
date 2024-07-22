const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Recipes = sequelize.define('recipes', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: false
  },
  details: {
    type: Sequelize.TEXT('long'),
    allowNull: true
  },
  ingredients: {
    type: Sequelize.TEXT('long'),
    allowNull: true
  },
  instructions: {
    type: Sequelize.TEXT('long'),
    allowNull: true
  },
  tags: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Recipes;
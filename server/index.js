const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const sequelize = require("./utils/database");

const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/recipe");
const adminRoutes = require("./routes/admin");

const Users = require("./models/users")
const Recipes = require("./models/recipes")
const Reviews = require("./models/reviews")
const Favourites = require("./models/favourites")

app.use(cors({
  origin:'*',
  methods:['GET','POST','DELETE','PUT'],
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));


app.use("/user", userRoutes);
app.use("/recipe", recipeRoutes);
app.use("/admin", adminRoutes);

Users.hasMany(Recipes);
Recipes.belongsTo(Users);

Users.hasMany(Reviews, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reviews.belongsTo(Users, { foreignKey: 'userId' });

Recipes.hasMany(Reviews, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
Reviews.belongsTo(Recipes, { foreignKey: 'recipeId' });

Users.belongsToMany(Recipes, { through: Favourites, foreignKey: 'userId', otherKey: 'recipeId' });
Recipes.belongsToMany(Users, { through: Favourites, foreignKey: 'recipeId', otherKey: 'userId' });

Favourites.belongsTo(Users, { foreignKey: 'userId' });
Favourites.belongsTo(Recipes, { foreignKey: 'recipeId' });
Users.hasMany(Favourites, { foreignKey: 'userId', onDelete: 'CASCADE' });
Recipes.hasMany(Favourites, { foreignKey: 'recipeId', onDelete: 'CASCADE' });

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
    console.log(
      `\u001b[1;32m app listening on port : ${port} \u001b[0m`
    );
  })
  .catch((err) => {
    console.log(err);
  });
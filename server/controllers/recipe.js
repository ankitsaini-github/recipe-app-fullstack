const Recipes = require("../models/recipes");
const Reviews = require("../models/reviews");
const Users = require("../models/users");
const Favourites = require("../models/favourites");

const sequelize = require("../utils/database");
const { Op } = require("sequelize");

exports.allRecipe = async (req, res) => {
  const { userId } = req.query;

  try {
    let recipes;
    if (userId) {
      recipes = await Recipes.findAll({ where: { userId: userId } });
    } else {
      recipes = await Recipes.findAll();
    }
    res.status(200).json({
      success: true,
      recipes: recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recipes",
    });
  }
};

exports.addRecipe = async (req, res) => {
  const { title, imageUrl, details, tags, ingredients, instructions } =
    req.body;

  try {
    const newRecipe = await Recipes.create({
      title,
      imageUrl,
      details,
      tags,
      ingredients,
      instructions,
      createdBy: req.user.name,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      recipe: newRecipe,
      message: "Recipe added successfully.",
    });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add recipe",
    });
  }
};

exports.getRecipeById = async (req, res) => {
  const { id } = req.params;
  console.log(" got id = ", id);
  try {
 
    const recipe = await Recipes.findByPk(id, {
      include: [
        {
          model: Reviews,
          include: [
            {
              model: Users,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not Found." });
    }
    const isFavourite = await Favourites.findOne({
      where: {
        userId: req.user.id,
        recipeId: id,
      },
    });
    res.status(201).json({
      success: true,
      recipe: recipe,
      isFavourite: !!isFavourite
    });
  } catch (error) {
    console.error("Error fetching single recipe:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recipe",
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipes.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    if(req.user.isAdmin === false &&  recipe.userId === req.user.id){
      return res.status(401).json({ error: "User not Authorized" });
    }
    await recipe.destroy();

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete recipe",
    });
  }
};

exports.searchRecipes = async (req, res) => {
  const { query } = req.query;

  try {

    const recipes = await Recipes.findAll({
      where: {
        [Op.or]: [
          {
            tags: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            title: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            ingredients: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            createdBy: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
    });

    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ error: `No recipes found matching with "${query}".` });
    }

    res.status(200).json({
      success: true,
      recipes: recipes,
    });
  } catch (error) {
    console.error("Error searching recipes by tag:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search recipes",
    });
  }
};

exports.updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, imageUrl, details, tags } = req.body;

  try {
    const recipe = await Recipes.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    if (recipe.userId !== req.user.id) {
      return res.status(401).json({ error: "User not Authorized" });
    }

    await recipe.update({ title, imageUrl, details, tags });
    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      recipe: recipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update recipe",
    });
  }
};

exports.addReview = async (req, res) => {
  const { recipeId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const result = await Reviews.create({
      recipeId,
      userId,
      rating,
      comment,
    });
    const review = {
      ...result.toJSON(),
      user: {
        name: req.user.name,
      },
    };
    res.status(201).json({
      success: true,
      message: "Review added",
      review,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addFavourite = async(req,res)=>{
  const { recipeId } = req.body;
  const userId = req.user.id;

  try {
    const exists = await Favourites.findOne({ where: { userId, recipeId } });
    if (exists) {
      return res.status(400).json({ success: false, error: "Recipe is already in favourites." });
    }

    const favourite = await Favourites.create({
      userId,
      recipeId,
    });

    res.status(201).json({
      success: true,
      message: "Recipe added to favourites",
      favourite,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error.message });
  }
}

exports.getFavourites = async (req, res) => {
  const userId = req.user.id;

  try {
    const favourites = await Favourites.findAll({
      where: { userId },
      include: { model: Recipes },
    });

    res.status(200).json({
      success: true,
      favourites,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error.message });
  }
};
const express = require('express');

const recipeController = require('../controllers/recipe');
const {authenticateUser} = require('../middlewares/auth');

const router = express.Router();

router.get('/search', authenticateUser , recipeController.searchRecipes);
router.get('/favourites', authenticateUser , recipeController.getFavourites);
router.post('/favourites', authenticateUser , recipeController.addFavourite);
router.post('/review', authenticateUser , recipeController.addReview);
router.get('/:id', authenticateUser , recipeController.getRecipeById);
router.delete('/:id', authenticateUser , recipeController.deleteRecipe);
router.put('/:id', authenticateUser , recipeController.updateRecipe);
router.get('/', authenticateUser , recipeController.allRecipe);
router.post('/', authenticateUser , recipeController.addRecipe);

module.exports = router;
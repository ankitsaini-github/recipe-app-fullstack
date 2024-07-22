import React, { useEffect, useState } from "react";

import RecipeList from "./RecipeList";
import axios from "axios";
import { toast } from "react-toastify";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    imageUrl: "",
    details: "",
    tags: "",
    ingredients: "",
    instructions: "",
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/recipe?userId=${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (!res.data.success) {
          toast.error("Failed to fetch recipes");
          return;
        }
        // console.log('my recipes',res.data.recipes)
        setRecipes(res.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error.response.data.error);
        toast.error(error.response.data.error);
      }
    };

    fetchRecipes();
  }, []);

  const handleAddRecipeClick = () => {
    setIsAdding(true);
    setIsEditing(false);
    setNewRecipe({
      title: "",
      imageUrl: "",
      details: "",
      tags: "",
      ingredients: "",
      instructions: "",
    });
  };

  const handleEditRecipeClick = (recipe) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentRecipeId(recipe.id);
    setNewRecipe({
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      details: recipe.details,
      tags: recipe.tags,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // const formattedRecipe = {
    //   ...newRecipe,
    //   ingredients: newRecipe.ingredients.split(",").map((item) => item.trim()),
    //   instructions: newRecipe.instructions.split(",").map((item) => item.trim()),
    // };

    try {
      if (isEditing) {
        const res = await axios.put(
          `${import.meta.env.VITE_SERVER_IP}/recipe/${currentRecipeId}`,
          newRecipe,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (res.data.success) {
          setRecipes((prev) =>
            prev.map((recipe) =>
              recipe.id === currentRecipeId ? res.data.recipe : recipe
            )
          );
          toast.success(res.data.message);
        } else {
          toast.error("Failed to update recipe");
        }
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_IP}/recipe`,
          newRecipe,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (res.data.success) {
          setRecipes((prevRecipes) => [...prevRecipes, res.data.recipe]);
          toast.success(res.data.message);
        } else {
          toast.error("Failed to add recipe");
        }
      }
      setNewRecipe({
        title: "",
        imageUrl: "",
        details: "",
        tags: "",
        ingredients: "",
        instructions: "",
      });
      setIsAdding(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error(error.response.data.error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setNewRecipe({
      title: "",
      imageUrl: "",
      details: "",
      tags: "",
      ingredients: "",
      instructions: "",
    });
  };

  const handleDeleteRecipe = async (id) => {
    if (confirm("Delete this Recipe?")) {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_SERVER_IP}/recipe/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.success) {
          setRecipes((prevRecipes) =>
            prevRecipes.filter((recipe) => recipe.id !== id)
          );
          toast.success(response.data.message);
        } else {
          console.error("Failed to delete recipe");
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow container p-4 flex flex-col">
      <div className="pb-5 mb-5 border-b border-zinc-500 flex justify-between">
        <h3 className="text-orange-500 font-bold text-2xl">My Recipes</h3>
        <button
          onClick={handleAddRecipeClick}
          className="text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-lg px-5 py-1"
        >
          Add Recipe
        </button>
      </div>

      {isAdding || isEditing ? (
        <form className="mb-5" onSubmit={handleSaveRecipe}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="title">
              Recipe Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={newRecipe.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-zinc-600 rounded-lg bg-zinc-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="imageUrl">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              value={newRecipe.imageUrl}
              onChange={handleInputChange}
              className="w-full p-2 border border-zinc-600 rounded-lg bg-zinc-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="details">
              Details
            </label>
            <textarea
              name="details"
              id="details"
              value={newRecipe.details}
              onChange={handleInputChange}
              className="w-full p-2 border border-zinc-600 rounded-lg bg-zinc-700 text-white"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={newRecipe.tags}
              onChange={handleInputChange}
              className="w-full p-2 border border-zinc-600 rounded-lg bg-zinc-700 text-white"
              placeholder="e.g., spicy, vegetarian"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="ingredients">
              Ingredients (comma-separated)
            </label>
            <input
              type="text"
              name="ingredients"
              id="ingredients"
              value={newRecipe.ingredients}
              onChange={handleInputChange}
              className="w-full p-2 border border-zinc-600 rounded-lg bg-zinc-700 text-white"
              placeholder="e.g., 200g flour, 100g sugar"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="instructions">
              Instructions (comma-separated)
            </label>
            <textarea
              name="instructions"
              id="instructions"
              value={newRecipe.instructions}
              onChange={handleInputChange}
              className="w-full p-2 border border-zinc-600 rounded-lg bg-zinc-700 text-white"
              placeholder="e.g., Mix ingredients, Bake at 180°C for 20 minutes"
              required
            ></textarea>
          </div>

          <div className="flex justify-center gap-5">
            <button
              type="submit"
              className="text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-lg px-5 py-1"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-1"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <RecipeList
        list={recipes}
        onEdit={handleEditRecipeClick}
        onDelete={handleDeleteRecipe}
      />
    </div>
  );
};

export default MyRecipes;

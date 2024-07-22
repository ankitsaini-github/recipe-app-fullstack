import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Navbar from "../ui/Navbar";
import RecipeList from "./RecipeList";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/recipe`,
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
        setRecipes(res.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error.response.data.error);
        toast.error(error.response.data.error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = async (tag) => {
    const token = localStorage.getItem("token");
    const query = tag || searchTag;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_IP}/recipe/search`,
        {
          params: { query },
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        setRecipes(response.data.recipes);
      } else {
        console.error("Failed to search recipes");
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full h-full mt-8 flex flex-col items-center gap-5">
        <div className="mb-5 max-w-3xl flex items-center container py-5 px-10">
          <input
            type="text"
            placeholder="Search recipe..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full p-2 border-none border-zinc-600 rounded-l-lg bg-zinc-700 text-white"
          />
          <button
            onClick={()=>handleSearch()}
            className="text-white bg-gradient-to-b from-orange-400 to-orange-600 hover:to-orange-700 font-medium rounded-r-lg text-lg px-5 py-2"
          >
            Search
          </button>
        </div>

        <div className="bg-zinc-800 rounded-lg shadow container p-4 text-center">
          <h3 className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 inline-block text-transparent bg-clip-text font-rubik font-semibold text-3xl md:text-4xl my-5">Savor the magic of homemade.</h3>

          <div className="flex justify-evenly md:p-4">
            <Link to='/favourites' className={`py-1 px-2 text-lg md:text-3xl rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l cursor-pointer text-white font-bold flex items-center`} >
              <span className="text-lg font-semibold mr-1">Favourites</span> &#9829;
            </Link>
            <div onClick={()=>{handleSearch('trending');}} className={`py-1 px-2 text-lg md:text-2xl rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:bg-gradient-to-l cursor-pointer text-white font-bold flex items-center`} >
              <span className="text-lg font-semibold mr-1">Trending</span> 🔥
            </div>
            <Link to='/myprofile' className={`py-1 px-2 text-lg md:text-2xl rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:bg-gradient-to-l cursor-pointer text-white font-bold flex items-center`} >
              <span className="text-lg font-semibold mr-1">My Recipes</span> 🍽
            </Link>
          </div>
        </div>

        <div className="container p-4 ">
          <RecipeList list={recipes} card={true} />
        </div>
      </div>
    </>
  );
};

export default Home;

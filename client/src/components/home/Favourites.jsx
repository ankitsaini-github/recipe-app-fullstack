import React, { useEffect, useState } from "react";

import Navbar from "../ui/Navbar";
import RecipeList from "./RecipeList";
import axios from "axios";
import { toast } from "react-toastify";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_IP}/recipe/favourites`, {
          headers: {
            Authorization: token,
          },
        });

        if (res.data.success) {
          console.log('favourites = ',res.data.favourites)

          let recipes = res.data.favourites.map(i=>i.recipe);
          setFavourites(recipes);
          // setFavourites(res.data.favourites);
        } else {
          toast.error("Failed to fetch favourites");
        }
      } catch (error) {
        console.error("Error fetching favourites:", error);
        toast.error("Error fetching favourites");
      }
    };

    fetchFavourites();
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full h-full mt-8 flex flex-col items-center gap-5">
        <div className="max-w-4xl w-full bg-zinc-800 p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl text-amber-500 font-bold mb-4">My Favourite Recipes</h1>
          <RecipeList list={favourites} />
        </div>
      </div>
    </>
  );
};

export default Favourites;

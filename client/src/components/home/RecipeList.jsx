import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const RecipeList = ({ list, onDelete, card, onEdit }) => {
  const [sortedList, setSortedList] = useState([...list]);
  const [sortBy, setSortBy] = useState("");

  const sortRecipes = (type, listToSort = sortedList) => {
    let sortedArray = [];
    if (type === "name") {
      sortedArray = [...listToSort].sort((a, b) => a.title.localeCompare(b.title));
    } else if (type === "date") {
      sortedArray = [...listToSort].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setSortedList(sortedArray);
    setSortBy(type);
  };

  useEffect(() => {
    setSortedList([...list]);
    if (sortBy) {
      sortRecipes(sortBy, list);
    }
  }, [list, sortBy]);

  return (
    <>
      <div className="mb-8 py-2 px-4 flex justify-between bg-zinc-800 rounded-lg">
        <div className="flex gap-4">
          <span className="text-orange-500 font-semibold">Sort By :</span>
          <span
            className={`text-amber-400 cursor-pointer ${sortBy === "name" ? "underline" : ""}`}
            onClick={() => sortRecipes("name")}
          >
            Name
          </span>
          <span
            className={`text-amber-400 cursor-pointer ${sortBy === "date" ? "underline" : ""}`}
            onClick={() => sortRecipes("date")}
          >
            Latest
          </span>
        </div>
      </div>
      {sortedList.length > 0 ? (
        <ul className={card ? "flex flex-wrap gap-5 justify-center" : ""}>
          {sortedList.map((recipe) => (
            <li
              key={recipe.id}
              className={
                card
                  ? " max-w-96 bg-zinc-800 p-5 rounded-lg hover:border-b-2 border-orange-500"
                  : "flex flex-col md:flex-row mb-5 p-5 bg-zinc-900 rounded-lg hover:border-b-2 border-orange-500 "
              }
            >
              <div
                className={`w-full  flex-shrink-0 mr-0 md:mr-8 mb-4 ${
                  card ? "h-80 md:h-60 mb-4" : "h-48 md:h-40 md:mb-0 md:w-40"
                }`}
              >
                <Link to={`/recipe/${recipe.id}`}>
                  <img
                    src={recipe.imageUrl.length > 0 ? recipe.imageUrl : "noimage.png"}
                    alt={recipe.title}
                    className={`w-full h-full object-cover rounded-lg `}
                  />
                </Link>
              </div>
              <div className="flex-1">
                <h5 className="text-xl text-amber-500 font-bold pb-2 mb-2  border-b border-zinc-600">
                  <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
                </h5>
                <p
                  className={`text-md text-gray-300 line-clamp-2 ${
                    card ? "" : "md:line-clamp-1"
                  }`}
                >
                  {recipe.details}
                </p>
                <div className="mt-4">
                  {recipe.tags && (
                    <p className="text-sm text-gray-300 flex flex-wrap items-center">
                      <span className="mr-2">Tags : </span>
                      {recipe.tags.split(",").map((tag) => (
                        <span
                          key={tag.trim()}
                          className="mr-2 px-2 py-1 mb-1 bg-zinc-700 rounded text-amber-400"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                <div className="flex justify-between mt-2 items-center">
                  <span className="text-md text-zinc-500">
                    <Link to={`/profile/${recipe.userId}`}>Author : {recipe.createdBy}</Link>
                  </span>
                  <span>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(recipe)}
                        className="py-1 px-2 mr-1 bg-blue-700 hover:bg-blue-800 rounded text-white"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(recipe.id)}
                        className="py-1 px-2 bg-red-700 hover:bg-red-800 rounded text-white"
                      >
                        Remove
                      </button>
                    )}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-md text-zinc-300">No Recipe found.</p>
      )}
    </>
  );
};

export default RecipeList;

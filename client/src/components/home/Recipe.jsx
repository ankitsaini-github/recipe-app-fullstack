import React, { useEffect, useState } from "react";

import Navbar from "../ui/Navbar";
import { Rating } from "react-simple-star-rating";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Recipe = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState({});
  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false)

  const handleRating = (rate) => {
    // console.log("rate = ", rate);
    setMyRating(rate);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_IP}/recipe/review`,
        { recipeId, rating: myRating, comment },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.data.success) {
        // console.log('review = ',res.data.review)
        setReviews([...reviews, res.data.review]);
        setMyRating(0);
        setComment("");
        toast.success("Review added successfully!");
      } else {
        toast.error("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Error adding review");
    }
  };

  const handleAddFavorite = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_IP}/recipe/favourites`,
        { recipeId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.data.success) {
        toast.success("Recipe added to favourites!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error adding to favourites:", error);
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    const fetchRecipeById = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/recipe/${recipeId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!res.data.success) {
          toast.error("Failed to fetch recipe");
          return;
        }
        console.log('my recipe == ',res.data)
        setRecipe(res.data.recipe);
        setReviews(res.data.recipe.reviews);
        setIsFavourite(res.data.isFavourite);

      } catch (error) {
        console.error("Error fetching recipe:", error);
        toast.error(error.response.data.error);
      }
    };

    fetchRecipeById(recipeId);
  }, [recipeId]);

  const getOverallRating = ()=>{
    let rating=0;
    if(reviews.length>0){
      let sum=reviews.reduce((acc,cur)=>{
        acc=acc+cur.rating
        return acc;
      },0);
      rating = sum/recipe.reviews.length
    }
    return rating.toFixed(1);
  }

  return (
    <>
      <Navbar />
      <div className="w-full h-full mt-8 flex flex-col items-center gap-5">
        <div className="max-w-4xl w-full bg-zinc-800 p-8 shadow-lg rounded-lg">
          <div className="pb-4 border-b border-zinc-600 mb-4 flex justify-between items-center">
            <h1 className="text-3xl text-amber-500 font-bold ">
              {recipe.title}
            </h1>
          <div className="flex justify-center">
            <button
              onClick={handleAddFavorite}
              disabled={isFavourite}
              className={`py-1 px-2 text-3xl rounded-lg ${isFavourite?'bg-rose-600':'bg-amber-500 hover:bg-amber-600'} text-zinc-800 font-bold`}
            >
              &#9829;
            </button>
          </div>
          </div>

          
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />

          <div className="pb-5 flex justify-between border-b border-zinc-600">
            <div>
              <Rating
                initialValue={getOverallRating()}
                size={"20"}
                readonly
                allowFraction
                SVGstyle={{ display: "inline" }}
              />
              <div className="text-zinc-300">Rating : {getOverallRating()}/5</div>
            </div>
            <span className="text-lg font-semibold text-zinc-400">
              Author : {recipe.createdBy}
            </span>
          </div>

          <div className="my-6">
            <h3 className="text-2xl font-semibold mb-2 text-amber-400">
              Details
            </h3>
            <p className="text-zinc-200">{recipe.details}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-amber-400">
              Ingredients
            </h2>
            <ul className="list-disc list-inside text-zinc-200">
              {recipe.ingredients?.split(",").map((ingredient, index) => (
                <li key={index} className="text-md">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-amber-400">
              Instructions
            </h2>
            <ol className="ml-4 list-decimal list-outside text-zinc-200">
              {recipe.instructions?.split(",").map((instruction, index) => (
                <li key={index} className="text-md mb-2">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>

          {/* Reviews Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2 text-amber-400">
              Reviews
            </h2>
            <div className="mb-6">
              {reviews.map((review, index) => (
                <div key={index} className="mb-4 p-4 rounded-lg bg-zinc-900">
                  <div className="flex justify-between items-center border-b pb-2 border-zinc-700">
                    <span className="text-md font-bold text-orange-500">
                      {review.user.name}
                    </span>
                    <div className="">
                      <Rating
                        initialValue={review.rating}
                        size={"15"}
                        readonly
                        SVGstyle={{ display: "inline" }}
                      />
                    </div>
                  </div>
                  <p className="text-zinc-200 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <h2 className="text-2xl font-semibold mb-2 text-amber-400">
              Rate & Review
            </h2>
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4 px-1 py-2 rounded-lg border border-zinc-600">
              <Rating
                onClick={handleRating}
                ratingValue={myRating}
                size={"20"}
                SVGstyle={{ display: "inline" }}
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment"
                className="w-full p-2 rounded-lg bg-zinc-700 text-zinc-200 "
              ></textarea>
              <button
                type="submit"
                className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-800 font-semibold"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recipe;

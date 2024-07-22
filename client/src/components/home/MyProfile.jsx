import React, { useEffect, useState } from "react";

import MyRecipes from "./MyRecipes";
import Navbar from "../ui/Navbar";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [userProfile, setUserProfile] = useState({
    userId:'',
    name:'',
    email:'',
    bio:'',
  });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/user/profile`,
          {
            headers: { Authorization: token },
          }
        );
        if (!res.data.success) {
          toast.error("Something went wrong!");
          return;
        }
        setUserProfile(res.data.userProfile);
      } catch (error) {
        console.log("Error while fetching groups: ", error.response.data.error);
        toast.error(error.response.data.error);
      }
    };
    fetchProfile();
  }, []);

  const profileEditHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_IP}/user/profile`,
        userProfile,
        {
          headers: { Authorization: token },
        }
      );
      if (!res.data.success) {
        toast.error("Failed to update profile.");
        return;
      }
      toast.success("Profile updated successfully!");
      setEdit(false);
    } catch (error) {
      console.log("Error while updating profile: ", error.response.data.error);
      toast.error(error.response.data.error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="w-full h-full mt-8 flex flex-col items-center gap-5">
        <div className="bg-zinc-800 rounded-lg shadow container p-4 flex flex-col">
          <h3 className="text-orange-500 font-bold text-2xl pb-5 mb-5 border-b border-zinc-500">
            My Profile
          </h3>
          <form
            className="space-y-4 md:space-y-6 flex flex-col items-center"
            onSubmit={profileEditHandler}
          >
            <div className="flex flex-col md:flex-row w-full md:w-2/3">
              <label
                htmlFor="myname"
                className=" mb-2 text-sm font-medium text-zinc-900 dark:text-white md:w-1/5 md:text-center"
              >
                User Name
              </label>
              <input
                type="text"
                name="myname"
                id="myname"
                className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                required
                disabled={!edit}
              />
            </div>

            <div className="flex flex-col md:flex-row w-full md:w-2/3">
              <label
                htmlFor="myemail"
                className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white md:w-1/5 md:text-center"
              >
                User Email
              </label>
              <input
                type="email"
                name="myemail"
                id="myemail"
                className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={userProfile.email}
                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                required
                disabled={!edit}
              />
            </div>

            <div className="flex flex-col md:flex-row w-full md:w-2/3">
              <label
                htmlFor="mypassword"
                className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white md:w-1/5 md:text-center"
              >
                User Bio
              </label>
              <textarea
                type="text"
                name="mybio"
                id="mybio"
                placeholder="bio"
                className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={userProfile.bio ? userProfile.bio : ""}
                onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                required
                disabled={!edit}
              />
            </div>

            {!edit ? (
              <button
                type="button"
                className="w-full sm:w-1/5 text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-lg px-5 py-1 text-center"
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
            ) : (
              <div className="w-full flex gap-5 justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-1/5 text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-lg px-5 py-1 text-center"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="w-full sm:w-1/5 text-white bg-zinc-500 hover:bg-zinc-600 focus:ring-2 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-lg px-5 py-1 text-center"
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        <MyRecipes/>
      </div>
    </>
  );
};

export default MyProfile;

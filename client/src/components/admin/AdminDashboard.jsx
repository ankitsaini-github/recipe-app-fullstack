import React, { useEffect, useState } from "react";

import Navbar from "../ui/Navbar";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/admin/all-data`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (res.data.success) {
          setUsers(res.data.data.users);
          setRecipes(res.data.data.recipes);
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const getAdminCount = ()=>{
    let count=users.reduce((acc,curr)=>{
      if(curr.isAdmin)
        acc+=1
      return acc
    },0)
    return count;
  };

  const addAdminHandler = async(userId)=>{
    if (confirm("Give Admin Rights to this User ?")) 
    {const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_IP}/admin/add-admin`,
        { userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isAdmin: true } : user
          )
        );
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error promoting user to admin:", error);
      toast.error("Error promoting user to admin");
    }}
  };

  const deleteUserHandler= async(userId)=>{
    if (confirm("Delete this User?")) 
    {const token = localStorage.getItem("token");

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_IP}/user/profile`,
        { userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.data.success) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) =>
            user.id !== userId
          )
        );
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error deleting user :", error);
      toast.error("Error deleting user");
    }}
  };

  const deleteRecipeHandler = async (id) => {
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
    <>
      <Navbar />
      <div className="w-full h-full mt-8 flex flex-col items-center gap-5">
        <div className="bg-zinc-800 rounded-lg shadow container p-4 flex flex-col">
          <h3 className="text-orange-500 font-bold text-2xl pb-5 mb-5 border-b border-zinc-500">
            Admin Dashboard
          </h3>
          <div className="p-5 flex mb-5 flex-wrap justify-evenly items-center border-b border-zinc-500 text-4xl text-zinc-300 font-mono">
            <div className="min-w-80 mb-10 p-8 rounded-lg bg-zinc-900 flex justify-around">
              <span>Admin</span>
              <span className="text-orange-500 font-bold">{getAdminCount()}</span>
            </div>
            <div className="min-w-80 mb-10 p-8 rounded-lg bg-zinc-900 flex justify-around">
              <span>Users</span>
              <span className="text-sky-400 font-bold">{users.length}</span>
            </div>
            <div className="min-w-80 mb-10 p-8 rounded-lg bg-zinc-900 flex justify-around">
              <span>Recipes</span>
              <span className="text-green-500 font-bold">{recipes.length}</span>
            </div>
          </div>
          <div className="pb-5 mb-5 border-b border-zinc-500">
            <h4 className="text-xl text-amber-500 font-semibold">Users</h4>
            <ul className="text-zinc-200 mt-5 font-rubik max-w-5xl mx-auto">
              {users.map((user) => (
                <li key={user.id} className="text-lg p-3 bg-zinc-700 rounded mb-2 flex justify-between hover:border-b-2 border-orange-500">
                  <span>{user.name} - {user.email} - {user.isAdmin ? "Admin" : "User"}</span>
                  <span>
                    {!user.isAdmin && <button className="bg-green-600 px-2 rounded" onClick={()=>addAdminHandler(user.id)}>Make Admin</button>}
                    <button className=" ml-3 bg-red-600 px-2 rounded" onClick={()=>deleteUserHandler(user.id)}>X</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl text-amber-500 font-semibold">Recipes</h4>
            <ul className="text-zinc-200 mt-5 font-rubik max-w-5xl mx-auto">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="text-lg p-3 bg-zinc-700 rounded mb-2 flex justify-between hover:border-b-2 border-orange-500">
                  <span>{recipe.title} ~by {recipe.createdBy}</span>
                  <span>
                    <button className="bg-red-600 px-2 rounded" onClick={()=>deleteRecipeHandler(recipe.id)}>X</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

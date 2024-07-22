import { Link, useHistory } from "react-router-dom";

import React from 'react'
import { authActions } from "../../store/authReducer";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const submitHandler = async (e)=>{
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      email:formData.get("email"),
      password:formData.get("password")
    }

    try {

      const res = await axios.post(`${import.meta.env.VITE_SERVER_IP}/user/login`,payload);

      if (res.status !== 200) {
        console.log("Error : ", res);
        toast.error('Login failed please try again.')
        return;
      }

      console.log("Server response:", res.data);
      dispatch(authActions.login({token:res.data.token, email:res.data.useremail, userId:res.data.userId, isAdmin:res.data.isAdmin}));
      toast.success(res.data.message);
      history.push('/home');

    } catch (error) {
      console.log("Error while Login : ", error.response.data.error);
      toast.error(error.response.data.error);
    }
  }

  return (
    <section className="bg-zinc-100 dark:bg-zinc-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 "
        >
          <img src="/recipedays.png" alt="" className=" w-52" />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-zinc-900 md:text-2xl dark:text-white">
              Welcome back !
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
              
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  autoComplete="on"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Log In
              </button>
              <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-orange-600 hover:underline dark:text-orange-500"
                >
                  Signup here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login
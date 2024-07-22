import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import React from 'react';
import { authActions } from "../../store/authReducer";
import { toast } from "react-toastify";

const Navbar = () => {
  const {pathname} = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const logoutHandler = ()=>{
      dispatch(authActions.logout());
      toast.success('Logout Successfull.');
      history.push('/login');
  }
  return (
    <nav className='w-full px-3 shadow bg-white dark:bg-zinc-700 flex items-center justify-between'>

      <span className="">
        <img src="/recipedays.png" alt="" className=' w-28'/>
      </span>

      <span className="flex gap-1 text-zinc-300 font-semibold text-sm md:text-lg">
        <Link to="/home" className={`py-1 px-2 border-orange-500 rounded ${pathname=='/home' && 'border-b-2 bg-zinc-800 text-orange-500'}`}>Home</Link>
        <Link to="/myprofile" className={`py-1 px-2 border-orange-500 rounded ${pathname=='/myprofile' && 'border-b-2 bg-zinc-800 text-orange-500'}`}>My Profile</Link>
        {isAdmin && <Link to="/admin" className={`py-1 px-2 text-amber-400 border-amber-400 rounded ${pathname=='/admin' && 'border-b-2 bg-zinc-800 text-amber-400'}`}>Admin</Link>}
      </span>
        <div className="py-1 px-2 text-sm md:text-lg cursor-pointer bg-gradient-to-b from-orange-400 to-orange-600 hover:to-orange-700 text-white rounded" onClick={logoutHandler}>
          Logout
        </div>

    </nav>
  )
  
}


export default Navbar
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import Dashboard from '../components/Dashboard';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  

   

  const handleLogout = () => {
    dispatch(logoutUser());
    
  };


  return (
    <div className="min-h-screen bg-base-200">
      
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1">
         <NavLink to="/" className="btn btn-ghost text-xl"><span className="text-blue-500">Grip Invest</span></NavLink>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost">
              {user?.firstName}
            </div>
            <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><button onClick={handleLogout}><span className="text-orange-500">Logout</span></button></li>
               {user.role=='admin'&&<li><NavLink to="/admin">Admin</NavLink></li>}
            </ul>
          </div>
        </div>
      </nav>
    <Dashboard/>
      </div>
       )}




export default Homepage;
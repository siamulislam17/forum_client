import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import { Menu } from 'lucide-react'; // Hamburger menu icon

const DashBoardLayOut = () => {
  const { toggleDarkMode } = useContext(AuthContext);
  const navigate = useNavigate();

  const gradientLight = 'bg-gradient-to-br from-white via-sky-100 to-white';
  const gradientDark = 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900';

  return (
    <div className={`${toggleDarkMode ? gradientDark : gradientLight} min-h-screen`}>
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        {/* Page Content */}
        <div className="drawer-content p-6">
          {/* Mobile menu button */}
          <div className="lg:hidden mb-4">
            <label htmlFor="dashboard-drawer" className="btn btn-ghost">
              <Menu className={`h-6 w-6 ${toggleDarkMode ? 'text-white' : 'text-black'}`} />
            </label>
          </div>

          <Outlet />
        </div>

        {/* Drawer Side */}
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <ul className={`
            menu p-4 w-72 min-h-full md:m-4 rounded-2xl border shadow-md 
            ${toggleDarkMode
              ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900 text-white border-gray-700'
              : 'bg-gradient-to-b from-green-100 via-blue-100 to-red-100 text-black border-gray-300'
            }
          `}>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'active' : ''}>My Profile</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/add-post" className={({ isActive }) => isActive ? 'active' : ''}>Add Post</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/my-posts" className={({ isActive }) => isActive ? 'active' : ''}>My Posts</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashBoardLayOut;

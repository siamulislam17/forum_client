import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import { Menu } from 'lucide-react';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';


const DashBoardLayOut = () => {
  const { toggleDarkMode, user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const [role, setRole] = useState(null); // 'admin' or 'user'

  const gradientLight = 'bg-gradient-to-br from-white via-sky-100 to-white';
  const gradientDark = 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900';

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users`)
        .then(res => {
          const currentUser = res.data.find(u => u.email === user.email);
          if (currentUser) {
            setRole(currentUser.role);
          }
        })
        .catch(err => {
          console.error('Failed to fetch user role:', err);
        });
    }
  }, [user, axiosSecure]);

  const navLinkClass = ({ isActive }) => isActive ? 'active' : '';

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

            {/* Common for all */}
            <li>
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
            </li>

            {/* Show user routes */}
            {role === 'user' && (
              <>
                <li>
                  <NavLink to="/dashboard/profile" className={navLinkClass}>My Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/add-post" className={navLinkClass}>Add Post</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/my-posts" className={navLinkClass}>My Posts</NavLink>
                </li>
              </>
            )}

            {/* Show admin routes */}
            {role === 'admin' && (
              <>
                <li>
                  <NavLink to="/dashboard/admin-profile" className={navLinkClass}>Admin Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/manage-users" className={navLinkClass}>Manage Users</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/reported-comments" className={navLinkClass}>Reported Comments/Activities</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/announcement" className={navLinkClass}>Make Announcement</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashBoardLayOut;

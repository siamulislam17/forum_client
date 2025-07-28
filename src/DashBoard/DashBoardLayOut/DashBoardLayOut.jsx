import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import { Menu } from 'lucide-react';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
import { useQuery } from '@tanstack/react-query';

const DashBoardLayOut = () => {
  const { toggleDarkMode, user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const gradientLight = 'bg-gradient-to-br from-white via-sky-100 to-white';
  const gradientDark = 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900';

  // ✅ React Query to get user role
  const { data: role, isLoading } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      const currentUser = res.data.find(u => u.email === user.email);
      return currentUser?.role || 'user'; // Default to 'user' if not found
    },
  });

  const navLinkClass = ({ isActive }) => isActive ? 'active' : '';

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

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
            menu p-4 w-72 min-h-full md:m-4 rounded-r-2xl md:rounded-2xl border shadow-md 
            ${toggleDarkMode
              ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900 text-white border-gray-700'
              : 'md:bg-gradient-to-b from-green-100 via-blue-100 to-red-100 md:text-black text-white bg-gray-800 border-gray-300'
            }
          `}>

            <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>

            {/* Routes for normal user */}
            {role === 'user' && (
              <>
                <li><NavLink to="/dashboard/profile" className={navLinkClass}>My Profile</NavLink></li>
                <li><NavLink to="/dashboard/add-post" className={navLinkClass}>Add Post</NavLink></li>
                <li><NavLink to="/dashboard/my-posts" className={navLinkClass}>My Posts</NavLink></li>
              </>
            )}

            {/* Routes for admin */}
            {role === 'admin' && (
              <>
                <li><NavLink to="/dashboard/admin-profile" className={navLinkClass}>Admin Profile</NavLink></li>
                <li><NavLink to="/dashboard/manage-users" className={navLinkClass}>Manage Users</NavLink></li>
                <li><NavLink to="/dashboard/reported-comments" className={navLinkClass}>Reported Comments</NavLink></li>
                <li><NavLink to="/dashboard/announcement" className={navLinkClass}>Make Announcement</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashBoardLayOut;

import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Bell, Menu, Sun, Moon } from 'lucide-react';
import Logo from '../../assets/Logo.png';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
import { AuthContext } from '../../Context/AuthContext';


const Navbar = () => {
  const { user, logOutUser, toggleDarkMode, setToggleDarkMode } = useContext(AuthContext);
  const axios = UseAxiosSecure();
  const location = useLocation();

  const [dropdown, setDropdown] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Fetch user role (similar to dashboard)
  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get('/users');
      const currentUser = res.data.find(u => u.email === user.email);
      return currentUser?.role || 'user';
    },
  });

  // Fetch announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await axios.get('/announcements');
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const handleLogout = async () => {
    try {
      await logOutUser();
    } catch (err) {
      console.error(err);
    }
  };

  // Styling classes based on dark mode
  const navBg = toggleDarkMode
  ? "bg-gray-800 bg-opacity-90 backdrop-blur-md text-white"
  : "bg-white/80 backdrop-blur-md shadow-md text-gray-900";
  const textColorClass = toggleDarkMode ? 'text-white' : 'text-gray-800';
  const borderClass = toggleDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBgClass = toggleDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

  // Common routes for all users
  const commonRoutes = [
    { to: '/', label: 'Home' },
    { to: '/blogs', label: 'Blogs' },
    { to: '/terms', label: 'Terms' },
  ];

  // Protected routes based on user role
  const protectedRoutes = user
    ? [
        ...(role === 'admin'
          ? [{ to: '/dashboard/announcement', label: 'Add Announcement' }]
          : [{ to: '/dashboard/add-post', label: 'Add Post' }]),
        { to: '/dashboard/welcome', label: 'Dashboard' },
      ]
    : [];

  const finalRoutes = [...commonRoutes, ...protectedRoutes];

  if (roleLoading) {
    return null; // or a loading spinner
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${navBg} shadow-md border-b ${borderClass}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full" />
          <span className={`font-bold text-lg ${textColorClass}`}>Forum Nest</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {finalRoutes.map((route) => (
            <Link
              key={route.to}
              to={route.to}
              className={`${textColorClass} hover:text-blue-500 transition ${
                location.pathname === route.to ? 'font-semibold text-blue-500' : ''
              }`}
            >
              {route.label}
            </Link>
          ))}

          {/* Notification Bell */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`p-2 rounded-full ${hoverBgClass}`}
              >
                <Bell className={`${toggleDarkMode ? 'text-white' : 'text-gray-700'}`} />
                {announcements.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {announcements.length}
                  </span>
                )}
              </button>
              {showNotifDropdown && announcements.length > 0 && (
                <div
                  className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg z-50 p-4 space-y-3 ${
                    toggleDarkMode
                      ? 'bg-gray-800 text-white border border-gray-700'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <h4 className="font-semibold text-sm mb-2">Announcements</h4>
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {announcements.slice(0, 4).map((a) => (
                      <li key={a._id} className="text-sm border-b pb-2 last:border-none">
                        <p className="font-medium">{a.title}</p>
                        <p className="text-xs opacity-70">
                          {new Date(a.date).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/announcements"
                    className="block text-blue-500 text-sm hover:underline text-right"
                  >
                    View All
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setToggleDarkMode(!toggleDarkMode)}
            className={`p-2 rounded-full ${hoverBgClass}`}
            aria-label="Toggle Dark Mode"
          >
            {toggleDarkMode ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-700" size={20} />
            )}
          </button>

          {/* Auth Buttons */}
          {!user ? (
            <Link
              to="/login"
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${textColorClass}`}
            >
              Join Us
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-2"
              >
                <img
                  src={user.photoURL || 'https://i.ibb.co/2y9Fyxg/default-profile.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
                />
              </button>
              {dropdown && (
                <div
                  className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl z-20 ${
                    toggleDarkMode
                      ? 'bg-gray-800 text-white border border-gray-700'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className={`px-4 py-3 border-b ${borderClass} font-semibold text-sm`}>
                    {user.displayName || 'User'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-white rounded-b-xl text-red-500`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {/* Notification Bell (Mobile) */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`p-2 rounded-full ${hoverBgClass}`}
              >
                <Bell className={`${toggleDarkMode ? 'text-white' : 'text-gray-700'}`} />
                {announcements.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {announcements.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setToggleDarkMode(!toggleDarkMode)}
            className={`p-2 rounded-full ${hoverBgClass}`}
            aria-label="Toggle Dark Mode"
          >
            {toggleDarkMode ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-700" size={20} />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`p-2 rounded-full ${hoverBgClass}`}
          >
            <Menu className={`${toggleDarkMode ? 'text-white' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div
          className={`md:hidden px-4 py-3 space-y-2 border-t transition-transform duration-300 ease-out
          ${drawerOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} 
          ${bgClass} ${textColorClass} ${borderClass}`}
        >
          {finalRoutes.map((route) => (
            <Link
              key={route.to}
              to={route.to}
              className={`block px-3 py-2 rounded-lg ${hoverBgClass} ${
                location.pathname === route.to ? 'text-blue-500 font-medium' : ''
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              {route.label}
            </Link>
          ))}

          {!user ? (
            <Link
              to="/login"
              className={`block bg-blue-600 text-white px-4 py-2 rounded-lg text-center mt-2`}
              onClick={() => setDrawerOpen(false)}
            >
              Join Us
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setDrawerOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg ${hoverBgClass} text-red-500`}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
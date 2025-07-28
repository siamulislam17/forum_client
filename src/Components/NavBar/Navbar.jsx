import React, { useContext, useState, } from 'react';
import { Link } from 'react-router';
import { Bell, Menu, Sun, Moon } from 'lucide-react';
import Logo from '../../assets/Logo.png';

import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
  const { user, logOutUser, toggleDarkMode, setToggleDarkMode } = useContext(AuthContext);
  const axios = UseAxiosSecure();

  const [dropdown, setDropdown] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Fetch announcements via React‑Query
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

  const textColorClass = toggleDarkMode ? 'text-white' : 'text-black';
  const bgClass = toggleDarkMode ? 'bg-gray-900/80' : 'bg-white/30';

  return (
    <div className={`fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[95%] rounded-2xl ${bgClass} backdrop-blur-md shadow-md px-4 py-3 flex justify-between items-center`}>
      {/* Logo & Site Name */}
      <div className={`flex items-center gap-2 ${textColorClass}`}>
        <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full" />
        <span className="font-bold text-lg">Forum Nest</span>
      </div>

      {/* Desktop Menu */}
      <div className={`hidden md:flex items-center gap-6 ${textColorClass}`}>
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/membership" className="hover:text-blue-500">Membership</Link>

        {/* Notification bell with badge and dropdown */}
        <div className="relative">
          <Bell onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="cursor-pointer" />
          {announcements.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {announcements.length}
            </span>
          )}
          {showNotifDropdown && announcements.length > 0 && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg z-50 p-4 space-y-3 ${
              toggleDarkMode
                ? 'bg-gray-800 text-white border border-gray-700'
                : 'bg-white text-black border border-gray-200'
            }`}>
              <h4 className="font-semibold text-sm mb-2">Announcements</h4>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {announcements.slice(0, 4).map(a => (
                  <li key={a._id} className="text-sm border-b pb-2 last:border-none">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs opacity-70">{new Date(a.date).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
              <Link to="/announcements" className="block text-blue-500 text-sm hover:underline text-right">
                View All
              </Link>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setToggleDarkMode(!toggleDarkMode)}
          className="ml-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle Dark Mode"
        >
          {toggleDarkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-700" size={20} />}
        </button>
        
        {!user && (
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            Join Us
          </Link>
        )}

        {user && (
          <div className="relative">
            <img
              src={user.photoURL || 'https://i.ibb.co/2y9Fyxg/default-profile.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setDropdown(!dropdown)}
            />
            {dropdown && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl z-20 border ${
                  toggleDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-800'
                }`}
              >
                <div className="px-4 py-3 border-b dark:border-gray-600 font-semibold text-sm">
                  {user.displayName || 'User'}
                </div>
                <Link to="/dashboard/welcome" className="block px-4 py-2 text-sm hover:bg-blue-200 dark:hover:bg-gray-700 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setToggleDarkMode(!toggleDarkMode)}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle Dark Mode"
        >
          {toggleDarkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-700" size={20} />}
        </button>

        <Menu className={`cursor-pointer ${textColorClass}`} onClick={() => setDrawerOpen(!drawerOpen)} />
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className={`absolute top-full right-0 w-60 rounded-lg mt-2 p-4 space-y-3 z-50 shadow-xl ${
          toggleDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}>
          <Link to="/" className={`block hover:text-blue-500 ${textColorClass}`}>Home</Link>
          <Link to="/membership" className={`block hover:text-blue-500 ${textColorClass}`}>Membership</Link>
          {/* Notification bell with badge and dropdown */}
        <div className="relative">
          <Bell onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="cursor-pointer" />
          {announcements.length > 0 && (
            <span className="absolute -top-2 -left-0.5  bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {announcements.length}
            </span>
          )}
          {showNotifDropdown && announcements.length > 0 && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg z-50 p-4 space-y-3 ${
              toggleDarkMode
                ? 'bg-gray-800 text-white border border-gray-700'
                : 'bg-white text-black border border-gray-200'
            }`}>
              <h4 className="font-semibold text-sm mb-2">Announcements</h4>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {announcements.slice(0, 4).map(a => (
                  <li key={a._id} className="text-sm border-b pb-2 last:border-none">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs opacity-70">{new Date(a.date).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
              <Link to="/announcements" className="block text-blue-500 text-sm hover:underline text-right">
                View All
              </Link>
            </div>
          )}
        </div>


          {!user && (
            <Link
              to="/login"
              className="block bg-blue-600 text-white px-4 py-2 rounded-xl text-center"
            >
              Join Us
            </Link>
          )}

          {user && (
            <>
              <div className={`font-semibold ${textColorClass}`}>{user.displayName || 'User'}</div>
              <Link to="/dashboard" className={`block hover:text-blue-500 ${textColorClass}`}>Dashboard</Link>
              <button onClick={handleLogout} className={`w-full text-left hover:text-red-500 ${textColorClass}`}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;

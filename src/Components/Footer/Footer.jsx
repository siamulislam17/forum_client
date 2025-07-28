import React, { useContext } from 'react';
import Logo from '../../assets/Logo.png';

import { Link } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';

const Footer = () => {
  const { toggleDarkMode } = useContext(AuthContext);

  return (
    <footer className={`px-6 py-10  ${toggleDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Logo & Description */}
        <div>
          <img src={Logo} alt="Logo" className="h-10 mb-3" />
          <p className="leading-relaxed">
            Welcome to the community of Forum Nest where innovation meets collaboration.
          </p> 
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-3">Navigation</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2">
            <li>Email: support@parcelx.com</li>
            <li>Phone: +880 123 456 7890</li>
            <li>Location: Dhaka, Bangladesh</li>
          </ul>
        </div>

        {/* Social / Extra */}
        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className={`mt-8 border-t pt-4 text-center text-xs ${toggleDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        © {new Date().getFullYear()} ParcelX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

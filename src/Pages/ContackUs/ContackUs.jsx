import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const ContactUsGoogleForm = () => {
  const { toggleDarkMode } = useContext(AuthContext);

  return (
    <div
      className={`py-20 px-4 transition-colors duration-500 ${
        toggleDarkMode
          ? 'bg-gray-900 text-white'
          : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-gradient bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
          Contact Us
        </h2>

        <div className="flex justify-center">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSdTwoarGnAT4zIOPphoNGShE6BUAdDELCipUDG6iL423DgdYQ/viewform?embedded=true" 
            width="640" 
            height="800" 
            frameborder="0" 
            marginheight="0" 
            marginwidth="0">
            Loading…
            </iframe>

        </div>
      </div>
    </div>
  );
};

export default ContactUsGoogleForm;

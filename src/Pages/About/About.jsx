// src/Components/AboutSection/AboutSection.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const AboutSection = () => {
  const { toggleDarkMode } = useContext(AuthContext);

  const containerBg = toggleDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';

  return (
    <section className={`${containerBg}  px-6 transition-all duration-500`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Fancy Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-gradient bg-gradient-to-r from-fuchsia-600 to-purple-600  text-transparent">
          Behind the Threads
        </h2>

        {/* Subtitle */}
        <p className={`text-lg md:text-xl mb-10 ${toggleDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          Explore our vibrant community where ideas flourish, discussions spark, and connections are made.
        </p>

        {/* Highlight Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl shadow-lg transition hover:scale-105 ${
            toggleDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Engage</h3>
            <p className={`${toggleDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Participate in meaningful discussions and share your thoughts with others.
            </p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg transition hover:scale-105 ${
            toggleDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Share</h3>
            <p className={`${toggleDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Post articles, questions, or stories and connect with like-minded users.
            </p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg transition hover:scale-105 ${
            toggleDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Discover</h3>
            <p className={`${toggleDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Explore trending topics, hidden gems, and popular discussions every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

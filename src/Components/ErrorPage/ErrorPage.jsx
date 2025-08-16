import React from 'react';
import Lottie from 'lottie-react';
import errorAnimation from '../../../public/Error 404.json'; 

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      {/* Lottie Animation */}
      <Lottie animationData={errorAnimation} loop={true} className="w-80 md:w-96" />

      {/* Error Text */}
      <h1 className="text-4xl font-bold text-red-600 mt-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-2">Oops! The page you’re looking for doesn’t exist.</p>

      {/* Go Home Button */}
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-xl hover:bg-blue-700 transition"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default ErrorPage;

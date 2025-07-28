import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

const DashboardHome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
        Welcome to Your Dashboard
      </h1>
      
      <Typewriter
        words={[
          'Manage Your Deliveries Effortlessly ',
          'Assign Riders with One Click ',
          'Track and Monitor Parcels in Real-Time',
          'Grow Your Business with Us ',
        ]}
        loop={5}
        cursor
        cursorStyle='_'
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={700} 
      />
    </div>
  );
};

export default DashboardHome;
    
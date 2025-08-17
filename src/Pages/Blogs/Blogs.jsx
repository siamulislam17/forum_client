import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import dayjs from 'dayjs';

const Blogs = () => {
  const { toggleDarkMode } = useContext(AuthContext);

  const containerBg = toggleDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';

  const sectionText = toggleDarkMode ? 'text-gray-300' : 'text-gray-800';
  const sectionBg = toggleDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = toggleDarkMode ? 'border-gray-700' : 'border-gray-200';

  const blogPosts = [
    {
      title: 'Building a Social Forum from Scratch',
      content: `Creating a social forum involves designing a database for posts, users, and comments, setting up authentication, and building a frontend with interactive features like voting, sharing, and commenting.
      
      To make it scalable, you need to implement efficient data fetching and caching strategies. React Query or SWR can help with frontend state management, while MongoDB or PostgreSQL provides a flexible backend.
      
      Adding user authentication and authorization ensures only registered users can post or comment. Role-based access control allows admins to moderate content effectively. Finally, UI/UX design ensures the forum is responsive, accessible, and easy to navigate.`,
      author: 'John Doe',
      date: '2025-08-15'
    },
    {
      title: 'Optimizing User Engagement in Forums',
      content: `To keep users engaged, implement features like upvotes/downvotes, trending posts, notifications, badges, and personalized content. A smooth and responsive UI is key to retention.

      Real-time updates using WebSockets or Firebase make the platform interactive. Gamification techniques like badges, streaks, and achievements encourage active participation. Analytics help track user behavior and engagement, allowing improvements over time.`,
      author: 'Jane Smith',
      date: '2025-08-10'
    },
    {
      title: 'Implementing Dark Mode and Accessibility',
      content: `Dark mode and accessibility improvements make your forum usable for a wider audience. Use Tailwind CSS for theme toggling and semantic HTML for screen readers.

      Keyboard navigation, ARIA labels, and contrast checks improve accessibility. Storing user preferences in local storage or database allows theme persistence. Combining dark mode with responsive layouts enhances the user experience on all devices.`,
      author: 'Alex Johnson',
      date: '2025-08-12'
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={`${containerBg} min-h-screen px-6 py-16 transition-all duration-500`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <h1 className="text-3xl pt-6 font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600">
          Our Blogs
        </h1>
        <p className={`text-center text-lg ${sectionText}`}>
          Read our latest insights and tutorials on development, design, and more.
        </p>

        {/* Blog List */}
        <div className="space-y-6">
          {blogPosts.map((blog, idx) => (
            <div key={idx} className={`${sectionBg} p-6 rounded-xl shadow-md border ${borderColor} transition-all duration-300`}>
              <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">{blog.title}</h2>
              <div className={`flex justify-between text-sm mt-1 mb-3 ${sectionText}`}>
                <span className='text-gray-600'>By {blog.author}</span>
                <span>{dayjs(blog.date).format('MMMM D, YYYY')}</span>
              </div>

              <p className={`${sectionText} text-sm mb-3`}>
                {expandedIndex === idx ? blog.content : `${blog.content.substring(0, 100)}...`}
              </p>

              <button
                onClick={() => toggleExpand(idx)}
                className="text-blue-500 font-semibold text-sm hover:underline"
              >
                {expandedIndex === idx ? 'See Less' : 'Read More'}
              </button>
            </div>
          ))}
        </div>

        <p className={`text-center mt-8 ${sectionText}`}>
          Stay tuned for more blogs! We regularly post tips, tutorials, and insights to help you grow as a developer.
        </p>
      </div>
    </div>
  );
};

export default Blogs;

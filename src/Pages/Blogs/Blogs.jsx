// src/Components/Blogs/Blogs.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';



const Blogs = () => {
  const { toggleDarkMode } = useContext(AuthContext);

  const containerBg = toggleDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';

  const sectionText = toggleDarkMode ? 'text-gray-300' : 'text-gray-800';
  const sectionBg = toggleDarkMode ? 'bg-gray-800' : 'bg-white';

  // Example blog posts
  const blogPosts = [
    {
      title: 'How to Build a Social Forum',
      content: 'Creating a social forum requires a backend, frontend, authentication, posts, comments, and much more. Using React and Tailwind can simplify frontend development.'
    },
    {
      title: 'Understanding React Query',
      content: 'React Query helps in managing server state in React applications. It simplifies data fetching, caching, and updating your UI efficiently.'
    },
    {
      title: 'Dark Mode Implementation',
      content: 'Dark mode enhances user experience in low-light environments. You can toggle dark mode using React context and Tailwind CSS classes.'
    },
    {
      title: 'Adding Animations in React',
      content: 'Framer Motion and CSS transitions allow smooth animations for elements. Animations make your app look modern and interactive.'
    }
  ];

  return (
    <div className={`${containerBg} min-h-screen px-6 py-16 transition-all duration-500`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Gradient Title */}
        <h1 className="text-3xl pt-6 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600">
          Our Blogs
        </h1>
        <p className={`text-center text-lg ${sectionText}`}>
          Read our latest insights and tutorials on development, design, and more.
        </p>

        {/* Blog Accordion */}
        <div className="space-y-4">
          {blogPosts.map((blog, idx) => (
            <div key={idx} className={`${sectionBg} p-4 rounded-xl shadow-md transition-all duration-300`}>
              <div tabIndex={0} className="collapse collapse-arrow border border-gray-200 dark:border-gray-700 rounded-box">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-semibold text-purple-600 dark:text-purple-400">
                  {blog.title}
                </div>
                <div className={`collapse-content ${sectionText} text-sm`}>
                  <p>{blog.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className={`text-center mt-8 ${sectionText}`}>
          Stay tuned for more blogs! We regularly post tips, tutorials, and insights to help you grow as a developer.
        </p>
      </div>
    </div>
  );
};

export default Blogs;

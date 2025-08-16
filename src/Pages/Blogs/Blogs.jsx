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
    title: 'Building a Social Forum from Scratch',
    content: 'Creating a social forum involves designing a database for posts, users, and comments, setting up authentication, and building a frontend with interactive features like voting, sharing, and commenting.'
  },
  {
    title: 'Optimizing User Engagement in Forums',
    content: 'To keep users engaged, implement features like upvotes/downvotes, trending posts, notifications, badges, and personalized content. A smooth and responsive UI is key to retention.'
  },
  {
    title: 'Implementing Dark Mode and Accessibility',
    content: 'Dark mode and accessibility improvements make your forum usable for a wider audience. Use Tailwind CSS for theme toggling and semantic HTML for screen readers.'
  },
  {
    title: 'Handling Real-Time Updates in a Forum',
    content: 'Integrate real-time updates for posts, comments, and notifications using WebSockets or libraries like Pusher or Firebase to make your forum interactive and lively.'
  },
  {
    title: 'Moderation and Community Management',
    content: 'Moderation features like reporting posts, admin roles, and comment approval help maintain a safe community. Implementing clear rules and admin dashboards is essential.'
  },
  {
    title: 'Performance and Scalability Tips',
    content: 'For large forums, use pagination, caching, and optimized database queries. Tools like React Query, MongoDB indexing, and lazy loading can greatly improve performance.'
  }
];


  return (
    <div className={`${containerBg} min-h-screen px-6 py-16 transition-all duration-500`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Gradient Title */}
        <h1 className="text-3xl pt-6  font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600">
          Our Blogs
        </h1>
        <p className={`text-center text-gray-700 text-lg ${sectionText}`}>
          Read our latest insights and tutorials on development, design, and more.
        </p>

        {/* Blog Accordion */}
        <div className="space-y-4">
          {blogPosts.map((blog, idx) => (
            <div key={idx} className={`${sectionBg} p-4 rounded-xl shadow-md transition-all duration-300`}>
              <div tabIndex={0} className="collapse collapse-arrow border border-none rounded-box">
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

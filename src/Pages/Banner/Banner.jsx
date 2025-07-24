import React, { useContext, useState } from 'react';
import Lottie from 'lottie-react';
import { Typewriter } from 'react-simple-typewriter';
import { useQuery } from '@tanstack/react-query';

import { FaSearch, FaSadTear } from 'react-icons/fa';
import Animation from '../../../public/STUDENT.json';
import { AuthContext } from '../../Context/AuthContext';
import UseAsios from '../../UrlInstance/UseURL';



const axios = UseAsios();
const fetchSearchPosts = async ({ queryKey }) => {
  const [_key, tag] = queryKey;
  const { data } = await axios.get(`/posts/search?tag=${tag}`);
  return Array.isArray(data) ? data : []; // 💡 Safely ensure it’s an array
};

const Banner = () => {
  const { toggleDarkMode } = useContext(AuthContext);
  const [tag, setTag] = useState('');
  const [searchTag, setSearchTag] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['searchPosts', searchTag],
    queryFn: fetchSearchPosts,
    enabled: !!searchTag,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (tag.trim()) setSearchTag(tag.trim());
  };

  return (
    <div
      className={`px-6 py-10 transition-all duration-300 ${
        toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-800'
      }`}
    >
      <div className="grid md:grid-cols-2 items-center gap-10">
        {/* Left - Text and Search */}
        <div>
          <h1 className="text-4xl font-bold mb-4 leading-snug">
            <span className="text-blue-600 dark:text-blue-400">
              <Typewriter
                words={['Empower Minds.', 'Explore by Tags.', 'Connect, Share, Grow.']}
                loop
                cursor
                cursorStyle="_"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </h1>

          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Search posts by tag..."
              className="w-full px-4 py-2 rounded-md shadow border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Right - Animation */}
        <div className="w-full md:w-[80%] mx-auto">
          <Lottie animationData={Animation} loop />
        </div>
      </div>

      {/* Post Result */}
      <div className="mt-10">
        {isLoading ? (
          <p className="text-center text-lg font-medium">Loading...</p>
        ) : posts.length === 0 && searchTag ? (
          <div className="text-center text-xl font-semibold mt-6 text-red-500 flex justify-center items-center gap-3">
            <FaSadTear className="text-3xl" /> No posts found for "<span className="italic">{searchTag}</span>"
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="p-4 border rounded-md shadow hover:shadow-lg bg-white dark:bg-gray-800"
              >
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  {post.description?.slice(0, 100)}...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tags: {post.tags?.join(', ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;

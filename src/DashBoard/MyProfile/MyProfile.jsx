import React, { useContext, useEffect, useState } from 'react';

import { AiFillTrophy } from 'react-icons/ai';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router';

const MyProfile = () => {
  const { user, toggleDarkMode } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();
  console.log(user?.photoURL);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users?email=${user.email}`).then((res) => {
        setUserInfo(res.data[0]);
      });

      axiosSecure.get(`/posts?email=${user.email}`).then((res) => {
        // Get last 3 posts
        const sortedPosts = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setUserPosts(sortedPosts.slice(0, 3));
      });
    }
  }, [user?.email]);

  const badgeColor = userInfo.membership ? 'text-yellow-400' : 'text-amber-600';
  const badgeLabel = userInfo.membership ? 'Gold Badge' : 'Bronze Badge';

  return (
    <div
      className={`rounded-2xl shadow-2xl min-h-screen p-6 md:p-10 ${
        toggleDarkMode
          ? 'bg-gray-900 text-white'
          : 'bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 text-gray-900'
      }`}
    >
      <div className={`max-w-3xl mx-auto  rounded-2xl  p-6 md:p-8 `}>
        <div className="flex items-center gap-6 mb-6">
          <img
            src={user?.photoURL}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-blue-400"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.displayName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {user?.email}
            </p>
            <div className="flex items-center mt-2">
              <AiFillTrophy className={`text-2xl ${badgeColor} mr-2`} />
              <span className="text-sm font-semibold">{badgeLabel}</span>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-300 dark:border-gray-700" />

        <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
        {userPosts.length === 0 ? (
          <p className="text-sm text-gray-500">No recent posts found.</p>
        ) : (
          <ul className="space-y-4">
            {userPosts.map((post) => (
              <li
                onClick={() => navigate(`/post/${post._id}`)}
                key={post._id}
                className={`p-4 rounded-xl border ${
                  toggleDarkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300 shadow-md'
                }`}
              >
                <h4 className="text-lg font-semibold">{post.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {new Date(post.date).toLocaleDateString()} &mdash;{' '}
                  {post.tags?.join(', ')}
                </p>
                <p className="text-sm mt-2 line-clamp-3">
                  {post.content.slice(0, 150)}...
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyProfile;

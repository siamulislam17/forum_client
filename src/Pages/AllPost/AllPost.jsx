import React, { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaThumbsUp, FaThumbsDown, FaSun, FaMoon } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AuthContext } from '../../Context/AuthContext';
import UseAsios from '../../UrlInstance/UseURL';

dayjs.extend(relativeTime);

const fetchPosts = async ({ queryKey }) => {
  const axiosSecure = UseAsios();
  const [_key, { sortBy, page, limit }] = queryKey;
  const { data } = await axiosSecure.get('/posts/sorted', {
    params: { sort: sortBy, page, limit },
  });
  return data;
};

const AllPost = () => {
  const { toggleDarkMode, setToggleDarkMode } = useContext(AuthContext);

  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', { sortBy, page, limit }],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  const axiosSecure = UseAsios(); // Your axios instance
  const queryClient = useQueryClient();
   
const upvoteMutation = useMutation({
  mutationFn: (postId) => axiosSecure.post(`/posts/${postId}/upvote`),
  onSuccess: () => {
    queryClient.invalidateQueries(['posts']);
  },
});

const downvoteMutation = useMutation({
  mutationFn: (postId) => axiosSecure.post(`/posts/${postId}/downvote`),
  onSuccess: () => {
    queryClient.invalidateQueries(['posts']);
  },
});


  const handleUpvote = (postId) => {
    upvoteMutation.mutate(postId);
  };

  const handleDownvote = (postId) => {
    downvoteMutation.mutate(postId);
  };
  

  if (isLoading) return <p className="text-center py-10"><span className="loading loading-dots loading-lg"></span></p>;
  if (error) return <p className="text-center py-10 text-red-600">Error loading posts.</p>;

  return (
    <div className={`${toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-emerald-200 to-emerald-200 text-gray-700'} min-h-screen px-4 py-6 transition-colors duration-500`}>
      <div className="max-w-5xl mx-auto">
        

        {/* Sort Buttons */}
        <div className="mb-6 flex gap-4">
          <button
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              sortBy === 'date'
                ? 'bg-blue-600 text-white'
                : toggleDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white'
            }`}
            onClick={() => {
              setSortBy('date');
              setPage(1);
            }}
          >
            Sort by Date
          </button>

          <button
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              sortBy === 'popularity'
                ? 'bg-blue-600 text-white'
                : toggleDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white'
            }`}
            onClick={() => {
              setSortBy('popularity');
              setPage(1);
            }}
          >
            Sort by Popularity
          </button>
        </div>

        {/* Posts List */}
        <ul className="space-y-6">
          {data?.posts?.length ? (
            data.posts.map((post) => {
              const voteCount = (post.upVote || 0) - (post.downVote || 0);

              return (
                <li
                  key={post._id}
                  className={`p-6  rounded shadow-md hover:shadow-lg transition-colors ${
                    toggleDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:scale-101 transition-transform duration-300 '
                  }`}
                >
                  <div className="flex  items-center gap-4 mb-3">
                    <img
                      src={post.authorImage || '/default-profile.png'}
                      alt={post.author || 'Author'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{post.title}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {post.author} • {post.tags?.join(', ') || 'No tags'} • {dayjs(post.date).fromNow()}
                      </p>
                    </div>
                  </div>

                  <p className="mb-3">{post.content?.slice(0, 150) || 'No description'}...</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleUpvote(post._id)}>
                        <FaThumbsUp className="text-green-500 hover:text-green-700" />
                        <span>{post.upVote || 0}</span>
                      </div>

                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleDownvote(post._id)}>
                        <FaThumbsDown className="text-red-500 hover:text-red-700" />
                        <span>{post.downVote || 0}</span>
                      </div>

                      <div>
                        <strong>Votes: </strong>
                        {voteCount}
                      </div>

                      <div>
                        <strong>Comments: </strong>
                        {post.commentsCount || 0}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <p>No posts found.</p>
          )}
        </ul>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>

          <span>
            Page <strong>{page}</strong>
          </span>

          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (page * limit < data.totalCount) setPage((old) => old + 1);
            }}
            disabled={page * limit >= data.totalCount}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllPost;

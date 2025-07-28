import React, { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AuthContext } from '../../Context/AuthContext';
import UseAsios from '../../UrlInstance/UseURL';
import { useNavigate } from 'react-router';

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
  const { toggleDarkMode } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', { sortBy, page, limit }],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  const axiosSecure = UseAsios();
  const queryClient = useQueryClient();

  const upvoteMutation = useMutation({
    mutationFn: (postId) => axiosSecure.post(`/posts/${postId}/upvote`),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  });

  const downvoteMutation = useMutation({
    mutationFn: (postId) => axiosSecure.post(`/posts/${postId}/downvote`),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  });

  const handleUpvote = (postId) => upvoteMutation.mutate(postId);
  const handleDownvote = (postId) => downvoteMutation.mutate(postId);
  const navigate = useNavigate();
  const goToPostDetails = (postId) => navigate(`/post/${postId}`);
  const containerBg = toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';

  if (isLoading)
    return (
      <p className="text-center py-10">
        <span className="loading loading-dots loading-lg"></span>
      </p>
    );

  if (error)
    return <p className="text-center py-10 text-red-600">Error loading posts.</p>;

  return (
    <div
      className={`${containerBg} min-h-screen px-6 py-8 transition-all duration-500`}
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gradient bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
          Explore Posts
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          {['date', 'popularity'].map((type) => (
            <button
              key={type}
              className={`px-6 py-2 rounded-full font-semibold shadow-md transition-transform duration-300 transform hover:scale-105 ${
                sortBy === type
                  ? 'bg-purple-600 text-white'
                  : toggleDarkMode
                  ? 'bg-gray-800 text-gray-200'
                  : 'bg-white text-gray-700'
              }`}
              onClick={() => {
                setSortBy(type);
                setPage(1);
              }}
            >
              Sort by {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <ul className="space-y-6">
          {data?.posts?.length ? (
            data.posts.map((post) => {
              const voteCount = (post.upVote || 0) - (post.downVote || 0);
              return (
                <li
                  onClick={() => goToPostDetails(post._id)}
                  key={post._id}
                  className={`cursor-pointer border border-gray-300 shadow-lg rounded-xl p-6  hover:shadow-xl transform hover:scale-[1.01] transition-all ${
                    toggleDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={post.authorImage || '/default-profile.png'}
                      alt={post.author || 'Author'}
                      className="w-12 h-12 rounded-full border-2 border-purple-500 object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {post.author} • {post.tags?.join(', ') || 'No tags'} •{' '}
                        {dayjs(post.date).fromNow()}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-justify">
                    {post.content?.slice(0, 150) || 'No description'}...
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(post._id);
                        }}
                      >
                        <FaThumbsUp className="text-green-500 hover:text-green-700" />
                        <span>{post.upVote || 0}</span>
                      </div>
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownvote(post._id);
                        }}
                      >
                        <FaThumbsDown className="text-red-500 hover:text-red-700" />
                        <span>{post.downVote || 0}</span>
                      </div>
                      <span className="font-medium">Votes: {voteCount}</span>
                      <span>Comments: {post.commentsCount || 0}</span>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-center text-lg">No posts found.</p>
          )}
        </ul>

        {/* Pagination */}
        <div className="mt-10 flex justify-center items-center gap-6">
          <button
            className="px-5 py-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition disabled:opacity-40"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="font-medium">Page {page}</span>
          <button
            className="px-5 py-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition disabled:opacity-40"
            onClick={() => page * limit < data.totalCount && setPage((old) => old + 1)}
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

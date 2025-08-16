import React, { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';
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
      className={`${containerBg} min-h-screen px-4 py-8 transition-all duration-500`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gradient bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
          Explore Posts
        </h1>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {['date', 'popularity'].map((type) => (
            <button
              key={type}
              className={`px-5 py-1.5 rounded-full font-semibold shadow-md transition-all duration-200 ${
                sortBy === type
                  ? 'bg-purple-600 text-white shadow-purple-500/30'
                  : toggleDarkMode
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
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

        <ul className="space-y-5">
          {data?.posts?.length ? (
            data.posts.map((post) => {
              const voteCount = (post.upVote || 0) - (post.downVote || 0);
              const commentCount = post.comments?.length || 0;
              
              return (
                <li
                  onClick={() => goToPostDetails(post._id)}
                  key={post._id}
                  className={`cursor-pointer border rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${
                    toggleDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-purple-500' 
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={post.authorImage || '/default-profile.png'}
                      alt={post.author || 'Author'}
                      className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover mt-1"
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-1 line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>by {post.author}</span>
                        {post.tags?.length > 0 && (
                          <span className="flex items-center gap-1">
                            {post.tags.map(tag => (
                              <span 
                                key={tag} 
                                className={`px-2 py-0.5 rounded-full ${
                                  toggleDarkMode 
                                    ? 'bg-gray-700 text-purple-300' 
                                    : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </span>
                        )}
                        <span>{dayjs(post.date).fromNow()}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {post.content || 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(post._id);
                        }}
                      >
                        <FaThumbsUp className={`text-sm ${
                          toggleDarkMode 
                            ? 'text-green-400 group-hover:text-green-300' 
                            : 'text-green-600 group-hover:text-green-700'
                        }`} />
                        <span className="text-xs font-medium">{post.upVote || 0}</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5 cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownvote(post._id);
                        }}
                      >
                        <FaThumbsDown className={`text-sm ${
                          toggleDarkMode 
                            ? 'text-red-400 group-hover:text-red-300' 
                            : 'text-red-600 group-hover:text-red-700'
                        }`} />
                        <span className="text-xs font-medium">{post.downVote || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaComment className={`text-sm ${
                          toggleDarkMode ? 'text-blue-400' : 'text-blue-500'
                        }`} />
                        <span className="text-xs font-medium">{commentCount}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${
                      toggleDarkMode ? 'text-purple-300' : 'text-purple-600'
                    }`}>
                      {voteCount} {Math.abs(voteCount) === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-center text-lg py-10">No posts found.</p>
          )}
        </ul>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              toggleDarkMode 
                ? 'bg-purple-700 hover:bg-purple-600' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white transition disabled:opacity-40`}
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {page} of {Math.ceil(data?.totalCount / limit) || 1}
          </span>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              toggleDarkMode 
                ? 'bg-purple-700 hover:bg-purple-600' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white transition disabled:opacity-40`}
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
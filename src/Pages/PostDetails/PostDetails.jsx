import React, { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { FacebookShareButton, FacebookIcon, TwitterShareButton, LinkedinShareButton, TwitterIcon, LinkedinIcon } from 'react-share';
import { AuthContext } from '../../Context/AuthContext';

import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
import { X } from 'lucide-react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

const PostDetail = () => {
  const { id } = useParams();
  const postId = id;
  const { user, toggleDarkMode } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch post detail
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => axiosSecure.get(`/posts/${postId}`).then(res => res.data),
    enabled: !!postId, // ensure postId exists before running query
  });

  // Upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: () => axiosSecure.post(`/posts/${postId}/upvote`),
    onSuccess: () => queryClient.invalidateQueries(['post', postId]),
  });

  // Downvote mutation
  const downvoteMutation = useMutation({
    mutationFn: () => axiosSecure.post(`/posts/${postId}/downvote`),
    onSuccess: () => queryClient.invalidateQueries(['post', postId]),
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (commentText) =>
      axiosSecure.post(`/posts/${postId}/comments`, { text: commentText }),
    onSuccess: () => queryClient.invalidateQueries(['post', postId]),
  });

  const [commentText, setCommentText] = useState('');

  // Submit comment handler
  const handleCommentSubmit = () => {
    if (!user) {
      alert('Please login to comment.');
      return;
    }
    if (!commentText.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    commentMutation.mutate(commentText);
    setCommentText('');
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-600">Error loading post.</p>;
  if (!post) return <p className="text-center py-10">Post not found.</p>;

  return (
    <div
      className={`min-h-screen pt-25 px-6 py-8 transition-colors duration-500 ${
        toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Post Header */}
        <div className="flex items-center gap-4">
          <img
            src={post.authorImage || '/default-profile.png'}
            alt={post.author || 'Author'}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              by {post.author} • {dayjs(post.date).fromNow()}
            </p>
            <p className="mt-1 text-sm italic">Tags: {post.tags?.join(', ') || 'No tags'}</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="prose dark:prose-invert max-w-none">{post.content}</div>

        {/* Actions: Upvote / Downvote / Share */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => upvoteMutation.mutate()}
            disabled={upvoteMutation.isLoading}
            className="flex items-center gap-2 px-4 rounded-2xl py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white"
            aria-label="Upvote Post"
        >
            <FaThumbsUp /> ({post.upVote || 0})
        </button>

        <button
            onClick={() => downvoteMutation.mutate()}
            disabled={downvoteMutation.isLoading}
            className="flex items-center gap-2 px-4 rounded-2xl py-1.5 bg-red-500 hover:bg-red-700 disabled:opacity-50 text-white"
            aria-label="Downvote Post"
        >
            <FaThumbsDown /> ({post.downVote || 0})
        </button>


          <FacebookShareButton url={window.location.href} quote={post.title}>
            <FacebookIcon size={36} round />
          </FacebookShareButton>

          <TwitterShareButton url={window.location.href} quote={post.title}>
            <TwitterIcon size={36} round />
          </TwitterShareButton>

          <LinkedinShareButton url={window.location.href} quote={post.title}>
            <LinkedinIcon size={36} round />
          </LinkedinShareButton>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>

          {post.comments && post.comments.length > 0 ? (
            <ul className="space-y-4">
              {post.comments.map((c) => (
                <li
                  key={c._id}
                  className={`p-4 rounded ${toggleDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                >
                  <p className="font-semibold">{c.author || 'Anonymous'}</p>
                  <p>{c.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}

          {/* Add Comment */}
          {user ? (
            <div className="mt-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                className={`w-full p-3 rounded border ${
                  toggleDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                rows={4}
                aria-label="Write your comment"
              />
              <button
                onClick={handleCommentSubmit}
                disabled={commentMutation.isLoading}
                className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50"
              >
                Comment
              </button>
            </div>
          ) : (
            <p className="mt-6 text-gray-500">Please log in to comment.</p>
          )}
        </div>
      </div>


 
    </div>
  );
};

export default PostDetail;

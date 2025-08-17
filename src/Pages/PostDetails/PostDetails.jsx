import React, { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import useSound from 'use-sound';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  LinkedinShareButton, LinkedinIcon
} from 'react-share';
import { AuthContext } from '../../Context/AuthContext';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
import { X } from 'lucide-react';
import { FaThumbsDown, FaThumbsUp, FaShare } from 'react-icons/fa';

const PostDetail = () => {
  const { id } = useParams();
  const postId = id;
  const { user, toggleDarkMode } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [showShareModal, setShowShareModal] = useState(false);

  const [playLike] = useSound("https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3", { volume: 0.5 });
  const [playDislike] = useSound("https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3", { volume: 0.5 });
  const [playComment] = useSound("https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3", { volume: 0.5 });

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => axiosSecure.get(`/posts/${postId}`).then(res => res.data),
    enabled: !!postId,
  });

  const upvoteMutation = useMutation({
    mutationFn: () => axiosSecure.post(`/posts/${postId}/upvote`),
    onSuccess: () => {
      playLike();
      queryClient.invalidateQueries(['post', postId]);
    },
  });

  const downvoteMutation = useMutation({
    mutationFn: () => axiosSecure.post(`/posts/${postId}/downvote`),
    onSuccess: () => {
      playDislike();
      queryClient.invalidateQueries(['post', postId]);
    },
  });

  const commentMutation = useMutation({
    mutationFn: (commentText) => axiosSecure.post(`/posts/${postId}/comments`, { text: commentText }),
    onSuccess: () => {
      playComment();
      queryClient.invalidateQueries(['post', postId]);
    },
  });

  const [commentText, setCommentText] = useState('');

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

  if (isLoading) return <span className="loading loading-bars text-4xl mx-auto flex justify-center items-center h-screen"></span>;
  if (error) return <p className="text-center py-10 text-red-600">Error loading post.</p>;
  if (!post) return <p className="text-center py-10">Post not found.</p>;

  const bgMain = toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900';
  const bgCard = toggleDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderCard = toggleDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = toggleDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300';
  const hoverBg = toggleDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  return (
    <div className={`min-h-screen pt-25 px-4 py-8 transition-colors duration-500 ${bgMain}`}>
      <div className={`max-w-2xl mx-auto ${bgCard} rounded-lg shadow-md overflow-hidden border ${borderCard}`}>
        
        {/* Post Header */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <img src={post.authorImage || '/default-profile.png'} alt={post.author || 'Author'} className="w-10 h-10 rounded-full object-cover"/>
            <div>
              <h2 className="font-semibold">{post.author}</h2>
              <p className={`text-xs ${toggleDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {dayjs(post.date).fromNow()}
              </p>
            </div>
          </div>
          <h1 className="text-xl font-bold mt-3">{post.title}</h1>
          <p className={`text-sm ${toggleDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
            Tags: {post.tags?.join(', ') || 'No tags'}
          </p>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-4">
          <div className="prose dark:prose-invert max-w-none">{post.content}</div>
        </div>

        {/* Post Stats */}
        <div className={`px-4 py-2 border-t border-b flex justify-between text-sm ${toggleDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'}`}>
          <div>
            <span>{post.upVote || 0} likes</span>
            {post.downVote > 0 && <span className="ml-2">{post.downVote} dislikes</span>}
          </div>
          <div>
            <span>{post.comments?.length || 0} comments</span>
          </div>
        </div>

        {/* Actions */}
        <div className={`px-4 py-2 flex justify-between border-b ${borderCard}`}>
          <button onClick={() => upvoteMutation.mutate()} disabled={upvoteMutation.isLoading} className={`flex items-center justify-center gap-1 w-full py-2 rounded-md ${hoverBg}`}>
            <FaThumbsUp className="text-blue-500" /> Like
          </button>
          <button onClick={() => downvoteMutation.mutate()} disabled={downvoteMutation.isLoading} className={`flex items-center justify-center gap-1 w-full py-2 rounded-md ${hoverBg}`}>
            <FaThumbsDown className="text-red-500" /> Dislike
          </button>
          <button onClick={() => setShowShareModal(true)} className={`flex items-center justify-center gap-1 w-full py-2 rounded-md ${hoverBg}`}>
            <FaShare /> Share
          </button>
        </div>

        {/* Comments */}
        <div className="p-4">
          {user ? (
            <div className="flex gap-2 mb-4">
              <img src={user.photoURL || '/default-profile.png'} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full object-cover"/>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className={`w-full p-2 rounded-full border ${inputBg}`}
                  rows={1}
                  aria-label="Write your comment"
                />
                <div className="flex justify-end mt-2">
                  <button onClick={handleCommentSubmit} disabled={commentMutation.isLoading} className="px-4 py-1 rounded-full text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 font-semibold disabled:opacity-40 text-sm">
                    Post
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">Please log in to comment.</p>
          )}

          {post.comments?.length ? (
            <div className="space-y-3">
              {post.comments.map((c) => (
                <div key={c._id} className="flex gap-2">
                  <img src={c.authorImage || '/default-profile.png'} alt={c.author || 'Author'} className="w-8 h-8 rounded-full object-cover"/>
                  <div className={`flex-1 p-2 rounded-lg ${toggleDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="font-semibold text-sm">{c.author || 'Anonymous'}</p>
                    <p className="text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`relative p-6 rounded-lg shadow-lg max-w-sm w-full ${toggleDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <button onClick={() => setShowShareModal(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4">Share this post</h3>
            <div className="flex justify-center gap-4">
              <FacebookShareButton url={window.location.href} quote={post.title} onClick={() => setShowShareModal(false)}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <TwitterShareButton url={window.location.href} title={post.title} onClick={() => setShowShareModal(false)}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              <LinkedinShareButton url={window.location.href} title={post.title} onClick={() => setShowShareModal(false)}>
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>
            </div>

            <div className="mt-4">
              <div className={`flex items-center p-2 rounded-lg ${toggleDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <input type="text" value={window.location.href} readOnly className={`flex-1 bg-transparent outline-none text-sm ${toggleDarkMode ? 'text-white' : 'text-gray-900'}`} />
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }} className="text-blue-500 text-sm font-medium px-2">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;

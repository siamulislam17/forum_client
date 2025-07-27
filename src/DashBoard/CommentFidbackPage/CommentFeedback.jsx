import React, { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../Context/AuthContext';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';

const feedbackOptions = [
  'Inappropriate language',
  'Off-topic content',
  'Harassment or abuse',
];

const CommentsPage = () => {
  const { id } = useParams();
  const postId = id;
  const { user, toggleDarkMode } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  const [feedbackState, setFeedbackState] = useState({});

  // Fetch post with comments
  const { data: postData = {}, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts/${postId}`);
      return res.data;
    },
  });

  // Mutation to report comment
  const reportMutation = useMutation({
    mutationFn: ({ commentId, feedback }) =>
      axiosSecure.post(`/reports`, {
        commentId,
        feedback,
        reporter: user.email,
        postId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postId]);
    },
  });

  const handleFeedbackChange = (commentId, feedback) => {
    setFeedbackState((prev) => ({
      ...prev,
      [commentId]: { feedback, reported: prev[commentId]?.reported || false },
    }));
  };

  const handleReport = (commentId) => {
    const selected = feedbackState[commentId];
    if (!selected || !selected.feedback) return;

    reportMutation.mutate({ commentId, feedback: selected.feedback });

    // Disable the report button for this comment
    setFeedbackState((prev) => ({
      ...prev,
      [commentId]: { ...prev[commentId], reported: true },
    }));
  };

  if (isLoading)
    return (
      <div className="text-center mt-10">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <div
      className={`p-4 md:p-8 py-20 rounded-2xl shadow-md ${
        toggleDarkMode
          ? 'bg-gray-900 text-white'
          : 'bg-gradient-to-br from-green-100 via-blue-100 to-red-100 text-gray-900'
      }`}
    >
      <h2 className="text-3xl font-bold text-center mb-8">
        Comments for: <span className="">{postData.title || 'Loading...'}</span>
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table
          className={`w-full border-collapse ${
            toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          }`}
        >
          <thead>
            <tr className={toggleDarkMode ? 'bg-gray-700' : 'bg-blue-600 text-white'}>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Comment</th>
              <th className="p-4 text-left">Feedback</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {postData?.comments?.map((comment) => {
              const state = feedbackState[comment._id] || {};
              return (
                <tr
                  key={comment._id}
                  className={`${
                    toggleDarkMode ? 'hover:bg-gray-700 border-b border-gray-600' : 'hover:bg-blue-50 border-b border-gray-200'
                  }`}
                >
                  <td className="p-4">{comment.email}</td>
                  <td className="p-4">{comment.author}</td>
                  <td className="p-4">{comment.text}</td>
                  <td className="p-4">
                    <select
                      className={`w-full border rounded p-2 ${
                        toggleDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
                      }`}
                      value={state.feedback || ''}
                      onChange={(e) => handleFeedbackChange(comment._id, e.target.value)}
                      disabled={state.reported}
                    >
                      <option value="" disabled>
                        Select feedback
                      </option>
                      {feedbackOptions.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      disabled={!state.feedback || state.reported}
                      onClick={() => handleReport(comment._id)}
                      className={`w-full px-3 py-1 rounded text-sm font-semibold ${
                        state.reported
                          ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                          : toggleDarkMode
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {state.reported ? 'Reported' : 'Report'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {(!postData.comments || postData.comments.length === 0) && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No comments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentsPage;

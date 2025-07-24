import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import Swal from 'sweetalert2';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
import { AuthContext } from '../../Context/AuthContext';

const CommentPage = () => {
  const { id } = useParams();
  console.log(id);
  const postId = id;
  const axiosSecure = UseAxiosSecure();
  const { toggleDarkMode } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState({});
  const [reportedIds, setReportedIds] = useState([]);
  const [modalComment, setModalComment] = useState('');

  useEffect(() => {
    axiosSecure.get(`/comments/${postId}`).then((res) => {
      setComments(res.data || []);
    });
  }, [postId]);

  const handleReport = async (commentId, commentText, email, feedback) => {
    try {
      await axiosSecure.post('/reported-comments', {
        commentId,
        commentText,
        feedback,
        email,
        postId,
      });
      setReportedIds((prev) => [...prev, commentId]);
      Swal.fire('Reported!', 'Your report has been submitted.', 'success');
    } catch (err) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const feedbackOptions = [
    'Offensive content',
    'Spam or irrelevant',
    'Harassment or bullying',
  ];

  return (
    <div className={`min-h-screen p-6 ${toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-3xl font-bold text-center mb-8">Comments</h2>

      {comments.length === 0 ? (
        <p className="text-center text-gray-500">No comments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className={`${toggleDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Comment</th>
                <th className="px-4 py-3 text-left font-semibold">Feedback</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((cmt) => (
                <tr key={cmt._id} className="border-b border-gray-300">
                  <td className="px-4 py-2">{cmt.email}</td>
                  <td className="px-4 py-2">
                    {cmt.text.length > 30 ? (
                      <>
                        {cmt.text.slice(0, 30)}...
                        <button
                          onClick={() => setModalComment(cmt.text)}
                          className="ml-2 text-blue-500 underline hover:text-blue-400"
                        >
                          Read More
                        </button>
                      </>
                    ) : (
                      cmt.text
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={selectedFeedback[cmt._id] || ''}
                      onChange={(e) =>
                        setSelectedFeedback({ ...selectedFeedback, [cmt._id]: e.target.value })
                      }
                      className={`border rounded px-2 py-1 ${
                        toggleDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white'
                      }`}
                    >
                      <option value="">Select</option>
                      {feedbackOptions.map((fb, idx) => (
                        <option key={idx} value={fb}>
                          {fb}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className={`px-3 py-1 rounded font-medium ${
                        reportedIds.includes(cmt._id)
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white`}
                      onClick={() =>
                        handleReport(cmt._id, cmt.text, cmt.email, selectedFeedback[cmt._id])
                      }
                      disabled={reportedIds.includes(cmt._id)}
                    >
                      {reportedIds.includes(cmt._id) ? 'Reported' : 'Report'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalComment && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className={`rounded-lg p-6 max-w-md w-full ${
              toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}
          >
            <h3 className="text-lg font-bold mb-2">Full Comment</h3>
            <p>{modalComment}</p>
            <button
              onClick={() => setModalComment('')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentPage;

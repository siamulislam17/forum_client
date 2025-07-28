import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';
import UseAxiosSecure from '../../../UrlInstance/UseURlSecure';

const ReportedActivities = () => {
  const axiosSecure = UseAxiosSecure();
  const { toggleDarkMode } = useContext(AuthContext);
  const [contentDetails, setContentDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Pagination state
  const REPORTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all reports
  const { data: reports = [], refetch, isLoading, isError } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await axiosSecure.get('/reports');
      return res.data;
    }
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
  const endIndex = startIndex + REPORTS_PER_PAGE;
  const paginatedReports = reports.slice(startIndex, endIndex);
  const totalPages = Math.ceil(reports.length / REPORTS_PER_PAGE);

  // Fetch post or comment details for showing in modal/section
  const fetchContentDetails = async (contentId, postId) => {
    if (!contentId) {
      Swal.fire('Error', 'No content ID provided', 'error');
      return;
    }
    setIsLoadingDetails(true);
    try {
      // Try to get comment details if postId is present
      if (postId) {
        const postRes = await axiosSecure.get(`/posts/${postId}`);
        const comment = postRes.data.comments?.find(c => c._id === contentId);
        if (comment) {
          setContentDetails({
            type: 'comment',
            content: comment.text,
            author: comment.author,
            date: comment.date,
            postTitle: postRes.data.title,
          });
          setIsLoadingDetails(false);
          return;
        }
      }
      // Else get post details
      const postRes = await axiosSecure.get(`/posts/${contentId}`);
      setContentDetails({
        type: 'post',
        content: postRes.data.content,
        author: postRes.data.author,
        date: postRes.data.date,
        title: postRes.data.title,
      });
    } catch (error) {
      Swal.fire('Error', 'Content not found or may have been deleted.', 'error');
      setContentDetails(null);
      console.error('Error fetching content details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Dismiss a single report
  const handleDismiss = async (reportId) => {
    if (!reportId) {
      Swal.fire('Error', 'No report ID provided', 'error');
      return;
    }
    const result = await Swal.fire({
      title: 'Dismiss this report?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, dismiss',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/reports/${reportId}`);
        if (response.data.message === 'Report dismissed successfully') {
          Swal.fire('Dismissed!', 'The report has been dismissed.', 'success');
          refetch();
        } else {
          throw new Error('Failed to dismiss report');
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to dismiss report', 'error');
        console.error('Error dismissing report:', error);
      }
    }
  };

  // Delete content AND all reports related to it
const handleDeleteContent = async (contentId, reportIdToDismiss) => {
  if (!contentId) {
    Swal.fire('Error', 'No content ID provided', 'error');
    return;
  }

  const result = await Swal.fire({
    title: 'Delete reported content?',
    text: 'This action cannot be undone!',
    icon: 'error',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      const deleteRes = await axiosSecure.delete(`/content/${contentId}`);
      await axiosSecure.delete(`/reports/${reportIdToDismiss}`);

      if (
        deleteRes.data.deletedCount > 0 ||
        deleteRes.data.modifiedCount > 0
      ) {
        Swal.fire('Deleted!', 'Content and related reports deleted.', 'success');
        refetch();
        setContentDetails(null);
      } else {
        throw new Error('Content not found or already deleted');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to delete content.', 'error');
      console.error('Error deleting content:', error);
    }
  }
};



  if (isLoading) return (
    <div className={`p-6 min-h-screen flex items-center justify-center ${toggleDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  if (isError) return (
    <div className={`p-6 min-h-screen ${toggleDarkMode ? 'bg-gray-900 text-red-400' : 'bg-white text-red-600'}`}>
      Failed to load reports. Please try again later.
    </div>
  );

  return (
    <div className={`p-6 min-h-screen rounded-2xl shadow-2xl ${toggleDarkMode
      ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900 text-white border-gray-700'
      : 'bg-gradient-to-b from-green-100 via-blue-100 to-red-100 text-black border-gray-300'
    }`}>
      <h2 className="text-3xl font-semibold mb-6">Reported Activities & Comments</h2>

      {contentDetails && (
        <div className={`mb-6 p-4 rounded-lg ${toggleDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {isLoadingDetails ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">
                {contentDetails.type === 'comment' ? 'Comment Details' : 'Post Details'}
              </h3>
              {contentDetails.type === 'comment' ? (
                <>
                  <p className="mb-1"><strong>Post Title:</strong> {contentDetails.postTitle}</p>
                  <p className="mb-1"><strong>Comment Author:</strong> {contentDetails.author}</p>
                  <p className="mb-1"><strong>Comment Date:</strong> {new Date(contentDetails.date).toLocaleString()}</p>
                  <div className={`p-3 mt-2 rounded ${toggleDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <p>{contentDetails.content}</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-1"><strong>Post Title:</strong> {contentDetails.title}</p>
                  <p className="mb-1"><strong>Post Author:</strong> {contentDetails.author}</p>
                  <p className="mb-1"><strong>Post Date:</strong> {new Date(contentDetails.date).toLocaleString()}</p>
                  <div className={`p-3 mt-2 rounded ${toggleDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <p>{contentDetails.content}</p>
                  </div>
                </>
              )}
            </>
          )}
          <button
            onClick={() => setContentDetails(null)}
            className="btn btn-sm btn-ghost mt-2"
          >
            Close Details
          </button>
        </div>
      )}

      {reports.length === 0 ? (
        <div className={`p-4 rounded-lg text-center ${toggleDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          No reports found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className={`table w-full ${toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <thead className={toggleDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-200'}>
                <tr>
                  <th>Report ID</th>
                  <th>Feedback</th>
                  <th>Reporter</th>
                  <th>Reported At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map(report => (
                  <tr key={report._id} className={toggleDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}>
                    <td className="font-mono text-sm">{report._id.slice(0, 8)}...</td>
                    <td>{report.feedback}</td>
                    <td>{report.reporter}</td>
                    <td>{new Date(report.reportedAt).toLocaleString()}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => fetchContentDetails(report.commentId || report.postId, report.postId)}
                        className={`btn btn-sm btn-outline btn-info ${(!report.commentId && !report.postId) ? 'btn-disabled' : ''}`}
                        title={(!report.commentId && !report.postId) ? 'No content available' : 'View Details'}
                        disabled={!report.commentId && !report.postId}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDismiss(report._id)}
                        className="btn btn-sm btn-outline btn-success"
                        title="Dismiss Report"
                      >
                        Dismiss
                      </button>
                      <button
                            onClick={() => handleDeleteContent(
                                  report.commentId || report.postId,
                                  report._id
                                )}
                            className={`btn btn-sm btn-outline btn-error ${(!report.commentId && !report.postId) ? 'btn-disabled' : ''}`}
                            title={(!report.commentId && !report.postId) ? 'No content available' : 'Delete Content'}
                            disabled={!report.commentId && !report.postId}
                            >
                            Delete
                            </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2 flex-wrap">
              <button
                className="btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${currentPage === index + 1 ? 'btn-active btn-primary' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportedActivities;

import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';



const MyPosts = () => {
  const { user, toggleDarkMode } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsModal, setCommentsModal] = useState({
    isOpen: false,
    comments: [],
    postTitle: '',
  });

  // Fetch posts
  useEffect(() => {
    if (!user?.email) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/posts?email=${user.email}`);
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.email, axiosSecure]);

  // Delete post handler
  const handleDelete = async (id) => {
    console.log(id);
    // alert('Are you sure you want to delete this post?',id);
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/posts/${id}`);
        if (res.status === 200) {
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
          setPosts(posts.filter(post => post._id !== id));
        }
      } catch (err) {
        console.error('Delete failed:', err);
        Swal.fire('Error', 'Failed to delete the post.', 'error');
      }
    }
  };

  // Open comments modal
  const openComments = (post) => {
    setCommentsModal({
      isOpen: true,
      comments: post.comments || [],
      postTitle: post.title,
    });
  };

  // Close comments modal
  const closeComments = () => {
    setCommentsModal({
      isOpen: false,
      comments: [],
      postTitle: '',
    });
  };

  if (loading) return <div className="text-center p-6">Loading posts...</div>;

  return (
    <div className={`max-w-6xl mx-auto p-6 rounded-xl shadow-lg ${
      toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
    }`}>
      <h2 className="text-3xl font-bold mb-6 text-center">My Posts</h2>

      {posts.length === 0 ? (
        <p className="text-center">You have not posted anything yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className={`${toggleDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Post Title</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">UpVotes</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">DownVotes</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Comments</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr
                  key={post._id}
                  className={`${toggleDarkMode ? 'even:bg-gray-700 odd:bg-gray-600' : 'even:bg-gray-50 odd:bg-white'}`}
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{post.title}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">{post.upVote || 0}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">{post.downVote || 0}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                    <button
                      onClick={() => openComments(post)}
                      className="btn btn-sm btn-info px-3 py-1 rounded"
                    >
                      Comments
                    </button>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="btn btn-sm btn-danger px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Comments Modal */}
      {commentsModal.isOpen && (
        <>
          <input type="checkbox" id="comments-modal" className="modal-toggle" checked readOnly />
          <div className={`modal ${toggleDarkMode ? 'modal-open bg-black bg-opacity-80' : 'modal-open'}`}>
            <div className={`modal-box max-w-3xl ${toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
              <h3 className="font-bold text-lg mb-4">Comments for: {commentsModal.postTitle}</h3>
              {commentsModal.comments.length === 0 ? (
                <p className="italic">No comments yet.</p>
              ) : (
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                  {commentsModal.comments.map((comment, index) => (
                    <li key={index} className={`border p-3 rounded ${toggleDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                      <p>{comment}</p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="modal-action">
                <button
                  onClick={closeComments}
                  className="btn btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyPosts;

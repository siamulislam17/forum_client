import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
import { useQuery } from '@tanstack/react-query';

const AddPost = () => {
  const { user, toggleDarkMode } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorImage: user?.photoURL || '',
    tags: [],
    author: user?.displayName || '',
    email: user?.email || '',
  });

  const [postCount, setPostCount] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: tagsData = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tags');
      return res.data.map(tag => ({ label: tag.label, value: tag.label }));
    }
  });

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (!user?.email) return;

      try {
        const userRes = await axiosSecure.get(`/users?email=${user.email}`);
        const currentUser = userRes.data?.[0];
        setUserInfo(currentUser);

        const postsRes = await axiosSecure.get(`/posts?email=${user.email}`);
        const count = postsRes.data?.length || 0;
        setPostCount(count);

        if (currentUser?.membership === false && count === 4) {
          Swal.fire({
            icon: 'info',
            title: 'One Post Left',
            text: 'You can only post once more. Become a member to unlock more!',
          });
        }
      } catch (err) {
        console.error('Error fetching user or posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [user?.email, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (selectedOptions) => {
    const tags = selectedOptions.map((tag) => tag.value);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInfo?.membership === false && postCount >= 5) {
      Swal.fire('Limit reached', 'You cannot post more than 5 posts. Please become a member.', 'warning');
      return;
    }

    try {
      const res = await axiosSecure.post('/posts', {
        ...formData,
        date: new Date(),
        upVote: 0,
        downVote: 0,
        comments: [],
      });

      if (res.data.insertedId) {
        Swal.fire('Success', 'Post added!', 'success');
        setFormData({
          title: '',
          content: '',
          authorImage: user?.photoURL || '',
          tags: [],
          author: user?.displayName || '',
          email: user?.email || '',
        });

        setPostCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to post.', 'error');
    }
  };

  const inputBase = 'w-full rounded-lg px-4 py-2 border shadow-sm focus:outline-none focus:ring-2';
  const darkInput = 'bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500';
  const lightInput = 'bg-white text-black border-gray-300 placeholder-gray-600 focus:ring-blue-500';

  const inputClass = `${inputBase} ${toggleDarkMode ? darkInput : lightInput}`;
  const textareaClass = `${inputClass} resize-none h-32`;

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: toggleDarkMode ? '#1f2937' : '#ffffff',
      borderColor: state.isFocused ? '#3b82f6' : toggleDarkMode ? '#374151' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      color: toggleDarkMode ? '#fff' : '#000',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: toggleDarkMode ? '#1f2937' : '#ffffff',
      color: toggleDarkMode ? '#fff' : '#000',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: toggleDarkMode ? '#374151' : '#e5e7eb',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: toggleDarkMode ? '#fff' : '#000',
    }),
  };

  if (isLoading) return <div className="text-center text-lg py-10">Loading...</div>;

  if (userInfo?.membership === false && postCount >= 5) {
    return (
      <div className={`max-w-3xl mx-auto p-8 rounded-2xl shadow-lg text-center ${toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-3xl font-bold mb-4">Post Limit Reached</h2>
        <p className="mb-6">You've reached the post limit for non-members.</p>
        <button
          onClick={() => navigate('/membership')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Become a Member
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-xl transition duration-300 ${toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-4xl font-bold mb-8 text-center">Add New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-2 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter your post title"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 font-semibold">Tags</label>
          <Select
            isMulti
            options={tagsData}
            onChange={handleTagChange}
            value={tagsData.filter((tag) => formData.tags.includes(tag.value))}
            styles={customSelectStyles}
            placeholder="Select tags"
            classNamePrefix="react-select"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-2 font-semibold">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={textareaClass}
            placeholder="Write your post here..."
            required
          />
        </div>

        {/* Author Image */}
        <div>
          <label className="block mb-2 font-semibold">Author Image URL</label>
          <input
            type="text"
            name="authorImage"
            value={formData.authorImage}
            onChange={handleChange}
            className={inputClass}
            placeholder="Paste image URL"
            required
          />
          {formData.authorImage && (
            <img
              src={formData.authorImage}
              alt="Author"
              className="mt-4 w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;

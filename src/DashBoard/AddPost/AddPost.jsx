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
        // Fetch user info with membership status
        const userRes = await axiosSecure.get(`/users?email=${user.email}`);
        const currentUser = userRes.data?.[0]; // assuming array with one user
        setUserInfo(currentUser);

        // Fetch posts count by user email
        const postsRes = await axiosSecure.get(`/posts?email=${user.email}`);
        const count = postsRes.data?.length || 0;
        setPostCount(count);

        // Show warning if non-member has 4 posts
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

  // Tailwind classes for conditional mode
  const inputBase = 'w-full rounded-md px-4 py-2 border shadow-sm placeholder-opacity-75';
  const darkInput = 'bg-gray-900 text-white border-gray-700 placeholder-gray-400';
  const lightInput = 'bg-white text-black border-gray-300 placeholder-gray-600';

  const inputClass = `${inputBase} ${toggleDarkMode ? darkInput : lightInput}`;
  const textareaClass = `${inputBase} resize-none h-32 ${toggleDarkMode ? darkInput : lightInput}`;

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

  if (isLoading) return <div className="text-center">Loading...</div>;

  // Block post UI for non-members who reached limit
  if (userInfo?.membership === false && postCount >= 5) {
    return (
      <div className={`max-w-4xl mx-auto p-6 rounded-xl shadow-lg text-center ${toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-3xl font-bold mb-4">Post Limit Reached</h2>
        <p className="mb-6">You've reached the post limit for non-members.</p>
        <button
          onClick={() => navigate('/membership')}
          className="btn btn-primary rounded-md"
        >
          Become a Member
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 rounded-xl shadow-lg transition duration-300 ${toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-80 text-white'}`}>
      <h2 className="text-3xl font-bold mb-6 text-center">Add New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-2 font-medium">Title</label>
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
          <label className="block mb-2 font-medium">Tags</label>
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
          <label className="block mb-2 font-medium">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={textareaClass}
            placeholder="Write your post here..."
            required
          />
        </div>

        {/* Author Image + Preview */}
        <div>
          <label className="block mb-2 font-medium">Author Image URL</label>
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
              className="mt-3 w-20 h-20 rounded-full object-cover border shadow"
            />
          )}
        </div>

        {/* Submit */}
        <div>
          <button type="submit" className="btn btn-primary w-full rounded-md">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;

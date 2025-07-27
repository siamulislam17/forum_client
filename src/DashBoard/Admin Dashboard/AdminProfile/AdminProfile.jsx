import React, { useContext, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

import { AuthContext } from '../../../Context/AuthContext';

import UseAxiosSecure from '../../../UrlInstance/UseURlSecure';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminProfile = () => {
  const { user, toggleDarkMode } = useContext(AuthContext);
  const axios = UseAxiosSecure();
  const queryClient = useQueryClient();

  const [tagInput, setTagInput] = useState('');

  // Fetch stats (posts, users, comments)
  const { data: statsData = { totalPosts: 0, totalComments: 0, totalUsers: 0 }, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [postsRes, usersRes] = await Promise.all([axios.get('/posts'), axios.get('/users')]);
      const posts = postsRes.data;
      const users = usersRes.data;

      const totalComments = posts.reduce((acc, post) => acc + (post.comments ? post.comments.length : 0), 0);

      return {
        totalPosts: posts.length,
        totalComments,
        totalUsers: users.length,
      };
    },
  });

  // Fetch tags
  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await axios.get('/tags');
      if (Array.isArray(res.data)) return res.data;
      else if (res.data.tags && Array.isArray(res.data.tags)) return res.data.tags;
      else return [];
    },
  });

  // Mutation to add a tag
  const addTagMutation = useMutation({
  mutationFn: async (newTag) => {
    try {
      const res = await axios.post('/tags', { tag: newTag });
      console.log('Add Tag Response:', res.data); // Log response for debugging
      return {
        _id: res.data.insertedId || Date.now().toString(),
        label: newTag,
        value: newTag,
      };
    } catch (error) {
      console.error('Add Tag API error:', error.response || error.message);
      throw error; // Important to re-throw to trigger onError
    }
  },
  onSuccess: (newTag) => {
    queryClient.setQueryData(['tags'], (old = []) => [...old, newTag]);
    Swal.fire({
      title: 'Success',
      text: 'Tag added successfully',
      icon: 'success',
    });
    setTagInput('');
  },
  onError: (error) => {
    Swal.fire({
      title: 'Error',
      text: `Failed to add tag: ${error.response?.data?.error || error.message}`,
      icon: 'error',
    });
  },
});


  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    addTagMutation.mutate(tagInput.trim());
  };

  const pieData = [
    { name: 'Posts', value: statsData.totalPosts },
    { name: 'Comments', value: statsData.totalComments },
    { name: 'Users', value: statsData.totalUsers },
  ];

  return (
    <div
      className={`p-6 max-w-4xl mx-auto ${
        toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      } rounded-xl shadow-lg`}
    >
      <section className="flex items-center space-x-6 mb-10">
        <img
          src={user?.photo || 'https://via.placeholder.com/100'}
          alt="Admin Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{user?.name || 'Admin Name'}</h2>
          <p className="text-gray-500">{user?.email || 'admin@example.com'}</p>
          <div className="mt-3 flex space-x-4 text-sm">
            <span>Posts: {statsData.totalPosts}</span>
            <span>Comments: {statsData.totalComments}</span>
            <span>Users: {statsData.totalUsers}</span>
          </div>
        </div>
      </section>

      <section className="mb-10 mx-auto flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">Site Activity Overview</h3>
        <PieChart width={460} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Add Tags</h3>
        <form onSubmit={handleAddTag} className="flex space-x-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="New tag"
            className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-md font-semibold text-white ${
              toggleDarkMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={addTagMutation.isLoading}
          >
            {addTagMutation.isLoading ? 'Adding...' : 'Add'}
          </button>
        </form>

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="mt-4">
            <p>Existing tags (for dropdown):</p>
            <ul className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <li
                  key={tag._id}
                  className={`px-3 py-1 rounded-full text-sm hover:shadow-md ${
                    toggleDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold shadow-lg'
                  }`}
                >
                  #{tag.label || tag.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminProfile;

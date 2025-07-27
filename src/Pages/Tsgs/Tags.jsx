import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../Context/AuthContext';
import UseAsios from '../../UrlInstance/UseURL';

const Tags = () => {
  const axios= UseAsios();
  const { toggleDarkMode } = useContext(AuthContext);
  const { data: tags = [], isLoading, isError } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await axios.get('/tags');
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load tags</div>;

  return (
    <div
      className={`py-10 px-4 md:px-8 lg:px-16 transition duration-300 ease-in-out ${
        toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-800'
      }`}
    >
      <h2 className="text-3xl font-bold text-center mb-6">Explore Tags</h2>

      <div className="flex flex-wrap justify-center gap-4">
        {tags.map((tag, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-full font-medium text-sm shadow-md transform transition 
              duration-300 ease-in-out hover:scale-110
              ${
                toggleDarkMode
                  ? 'bg-blue-800 text-blue-100 hover:bg-blue-700'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
          >
            #{tag.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tags;

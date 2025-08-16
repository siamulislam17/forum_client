import React, { useEffect, useState, useContext } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import UseAsios from '../../UrlInstance/UseURL';
import { AuthContext } from '../../Context/AuthContext';

const Announcements = ({ showCountOnly = false }) => {
  const { toggleDarkMode } = useContext(AuthContext);
  const axios = UseAsios();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('/announcements');
        setAnnouncements(res.data || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, [axios]);

  // Only show count icon
  if (showCountOnly) {
    return (
      <div className="relative">
        <FaBullhorn className="text-xl" />
        {announcements.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {announcements.length}
          </span>
        )}
      </div>
    );
  }

  // Show nothing if no announcements
  if (!announcements.length) return null;

  // Theme-based styling
  const containerBg = toggleDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';
  const cardBg = toggleDarkMode
    ? 'bg-gray-800 border-gray-600 text-white'
    : 'bg-white border border-gray-300 text-gray-900';
  const descText = toggleDarkMode ? 'text-gray-300' : 'text-gray-700';
  const dateText = toggleDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`w-full  mx-auto px-4 md:px-16 py-24 ${containerBg}`}>
      <h2 className="text-3xl text-center mx-auto font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text flex justify-center items-center gap-2">
        <FaBullhorn /> Announcements
      </h2>

      <div className="grid max-w-[1600px] mx-auto grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((item) => (
          <div
            key={item._id}
            className={`rounded-xl shadow-lg p-6 border hover:shadow-2xl transition duration-300 ${cardBg}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={item.authorImage || 'https://i.ibb.co/6HDqPVM/default-user.png'}
                alt={item.authorName || 'Author'}
                className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover"
              />
              <div>
                <h4 className="font-semibold text-lg">{item.authorName || 'Unknown Author'}</h4>
                <p className={`text-xs ${dateText}`}>
                  {item.date ? new Date(item.date).toLocaleString() : 'No date provided'}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-pink-400">{item.title}</h3>
            <p className={`text-sm whitespace-pre-wrap ${descText}`}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;

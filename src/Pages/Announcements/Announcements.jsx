import React, { useEffect, useState, useContext } from 'react';
import UseAsios from '../../UrlInstance/UseURL';
import { FaBullhorn } from 'react-icons/fa';
import { AuthContext } from '../../Context/AuthContext';

const Announcements = ({ showCountOnly = false }) => {
    const { toggleDarkMode } = useContext(AuthContext);
    const axios = UseAsios();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('/announcements');
                setAnnouncements(response.data);
            } catch (err) {
                console.error('Failed to load announcements:', err);
            }
        };
        fetchAnnouncements();
    }, [axios]);

    // For icon badge only
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

    if (announcements.length === 0) return null;

    // Dark/light classes
    const containerBg = toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';
    const cardBg = toggleDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900';
    const descText = toggleDarkMode ? 'text-gray-300' : 'text-gray-700';
    const dateText = toggleDarkMode ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className={`container mx-auto lg:px-16  py-24 px-4 ${containerBg}`}>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text flex items-center gap-2">
                <FaBullhorn /> Announcements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {announcements.map((item) => (
                    <div
                        key={item._id}
                        className={`rounded-xl shadow-lg p-6 border hover:shadow-2xl transition ${cardBg}`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={item.authorImage}
                                alt={item.authorName}
                                className="w-12 h-12 rounded-full border-2 border-pink-500"
                            />
                            <div>
                                <h4 className="font-semibold text-lg">{item.authorName}</h4>
                                <p className={`text-xs ${dateText}`}>{new Date(item.date).toLocaleString()}</p>
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

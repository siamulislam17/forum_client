import axios from 'axios';
import React from 'react';

const UseAsios = () => {
    const axiosInstance = axios.create({
        baseURL: 'https://forum-server-3kblv06aj-siam-ul-islams-projects.vercel.app/',

});
    return (
        axiosInstance
    );
};

export default UseAsios;
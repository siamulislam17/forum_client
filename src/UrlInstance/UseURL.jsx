import axios from 'axios';
import React from 'react';

const UseAsios = () => {
    const axiosInstance = axios.create({
        baseURL: 'https://forum-server-three.vercel.app/',

});
    return (
        axiosInstance
    );
};

export default UseAsios;
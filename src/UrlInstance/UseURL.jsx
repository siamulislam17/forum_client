import axios from 'axios';
import React from 'react';

const UseAsios = () => {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/',

});
    return (
        axiosInstance
    );
};

export default UseAsios;